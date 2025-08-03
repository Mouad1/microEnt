import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DayInfo {
  day: number;
  weekday: string;
  status: 'Worked' | 'Not Worked' | 'Weekend';
}

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ActivityReportComponent implements OnInit {
  private readonly currentDate = new Date();

  // Signals
  readonly month = signal<number>(this.currentDate.getMonth() + 1);
  readonly year = signal<number>(this.currentDate.getFullYear());
  readonly days = signal<number[]>([]);
  readonly workedDays = signal<boolean[]>([]);
  readonly exportFormat = signal<'excel' | 'pdf'>('pdf');

  // Form
  readonly reportForm = this.fb.group({
    clientName: ['', Validators.required],
    projectName: ['', Validators.required],
    subject: ['', Validators.required],
  });

  // Computed values
  readonly workedDaysCount = computed(
    () => this.workedDays().filter((day) => day).length
  );

  readonly weekendDaysCount = computed(
    () => this.days().filter((day) => this.isWeekend(day)).length
  );

  readonly daysInfo = computed(() =>
    this.days().map((day) => this.getDayInfo(day))
  );

  constructor(private readonly fb: FormBuilder) {
    // Initialize days when month or year changes
    effect(() => {
      this.initializeDays();
    });
  }

  ngOnInit(): void {
    this.initializeDays();
  }

  private initializeDays(): void {
    const daysInMonth = new Date(this.year(), this.month(), 0).getDate();
    this.days.set(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Reset or preserve worked days
    const currentWorkedDays = this.workedDays();
    if (!currentWorkedDays || currentWorkedDays.length !== daysInMonth) {
      this.workedDays.set(Array(daysInMonth).fill(false));
    }
  }

  private getDayInfo(day: number): DayInfo {
    const date = new Date(this.year(), this.month() - 1, day);
    const isWeekend = this.isWeekend(day);
    const worked = this.workedDays()[day - 1];

    let status: DayInfo['status'];
    if (worked) {
      status = 'Worked';
    } else if (isWeekend) {
      status = 'Weekend';
    } else {
      status = 'Not Worked';
    }

    return {
      day,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      status,
    };
  }

  isWeekend(day: number): boolean {
    const date = new Date(this.year(), this.month() - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  getDayName(day: number): string {
    const date = new Date(this.year(), this.month() - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  toggleDay(index: number): void {
    const currentWorkedDays = [...this.workedDays()];
    currentWorkedDays[index] = !currentWorkedDays[index];
    this.workedDays.set(currentWorkedDays);
  }

  getFirstDayOffset(): number[] {
    const firstDay = new Date(this.year(), this.month() - 1, 1).getDay();
    return Array(firstDay).fill(null);
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.month() - 1 &&
      today.getFullYear() === this.year()
    );
  }

  setExportFormat(format: 'excel' | 'pdf'): void {
    this.exportFormat.set(format);
  }

  print(): void {
    if (this.reportForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const formValue = this.reportForm.getRawValue();
    const monthName = new Date(this.year(), this.month() - 1, 1).toLocaleString(
      'default',
      { month: 'long' }
    );

    if (!formValue.clientName || !formValue.projectName || !formValue.subject) {
      return;
    }

    // Get only worked days for the report
    const workedDaysInfo = this.daysInfo().filter(
      (info) => info.status === 'Worked'
    );

    if (this.exportFormat() === 'excel') {
      this.generateExcel(workedDaysInfo, monthName, {
        clientName: formValue.clientName,
        projectName: formValue.projectName,
        subject: formValue.subject,
      });
    } else {
      this.generatePDF(workedDaysInfo, monthName, {
        clientName: formValue.clientName,
        projectName: formValue.projectName,
        subject: formValue.subject,
      });
    }
  }

  private generateExcel(
    workedDaysInfo: DayInfo[],
    monthName: string,
    formValue: {
      clientName: string;
      projectName: string;
      subject: string;
    }
  ): void {
    const wb = XLSX.utils.book_new();

    // Add summary worksheet
    const summaryData = [
      ['Activity Report'],
      [],
      ['Client:', formValue.clientName],
      ['Project:', formValue.projectName],
      ['Subject:', formValue.subject],
      ['Period:', `${monthName} ${this.year()}`],
      [],
      ['Summary'],
      ['Total Days Worked:', `${this.workedDaysCount()} days`],
      ['Weekend Days:', `${this.weekendDaysCount()} days`],
      ['Generated on:', new Date().toLocaleDateString()],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Add worked days worksheet
    const ws = XLSX.utils.json_to_sheet(
      workedDaysInfo.map((info) => ({
        Day: info.day.toString().padStart(2, '0'),
        Weekday: info.weekday,
        Status: info.status,
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, 'Worked Days');

    // Save the workbook
    const fileName = `activity-report-${
      formValue.clientName
    }-${monthName}-${this.year()}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  private generatePDF(
    workedDaysInfo: DayInfo[],
    monthName: string,
    formValue: {
      clientName: string;
      projectName: string;
      subject: string;
    }
  ): void {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set document properties
    doc.setProperties({
      title: 'Activity Report',
      subject: formValue.subject,
      author: formValue.clientName,
      keywords: 'activity report, timesheet',
      creator: 'Activity Report Generator',
    });

    // Add header
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Activity Report', doc.internal.pageSize.width / 2, 12, {
      align: 'center',
    });

    // Add horizontal line
    doc.setDrawColor(44, 62, 80);
    doc.setLineWidth(0.5);
    doc.line(15, 15, doc.internal.pageSize.width - 15, 15);

    // Basic information section
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    const startY = 25;
    const leftMargin = 15;
    const lineHeight = 5;

    // Client and Project Information
    doc.setFont('helvetica', 'bold');
    doc.text('Client Information', leftMargin, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Client Name: ${formValue.clientName}`,
      leftMargin + 5,
      startY + lineHeight
    );
    doc.text(
      `Project: ${formValue.projectName}`,
      leftMargin + 5,
      startY + lineHeight * 2
    );
    doc.text(
      `Subject: ${formValue.subject}`,
      leftMargin + 5,
      startY + lineHeight * 3
    );
    doc.text(
      `Period: ${monthName} ${this.year()}`,
      leftMargin + 5,
      startY + lineHeight * 4
    );

    // Summary section
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', leftMargin, startY + lineHeight * 6);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Total Days Worked: ${this.workedDaysCount()} days`,
      leftMargin + 5,
      startY + lineHeight * 7
    );
    doc.text(
      `Weekend Days: ${this.weekendDaysCount()} days`,
      leftMargin + 5,
      startY + lineHeight * 8
    );

    // Format table data
    const tableData = workedDaysInfo.map((info) => [
      info.day.toString().padStart(2, '0'),
      info.weekday,
      info.status,
    ]);

    // Add daily report table
    autoTable(doc, {
      startY: startY + lineHeight * 10,
      head: [['Day', 'Weekday', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9,
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
        valign: 'middle',
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
        halign: 'center',
      },
      margin: { left: 15, right: 15 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      didDrawCell: (data) => {
        // Add borders
        const doc = data.doc;
        const cell = data.cell;
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.1);
        doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
        doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
        doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
        doc.line(
          cell.x + cell.width,
          cell.y,
          cell.x + cell.width,
          cell.y + cell.height
        );
      },
    });

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 5,
      { align: 'center' }
    );

    // Save the PDF
    const fileName = `activity-report-${
      formValue.clientName
    }-${monthName}-${this.year()}.pdf`;
    doc.save(fileName);
  }
}
