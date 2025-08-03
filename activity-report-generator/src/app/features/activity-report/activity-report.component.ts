import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface DayInfo {
  day: number;
  weekday: string;
  status: 'Worked' | 'Not Worked';
}

interface ActivityReportForm {
  clientName: string;
  projectName: string;
  subject: string;
  month: number;
  year: number;
}

@Component({
  selector: 'app-activity-report',
  templateUrl: './activity-report.component.html',
  styleUrls: ['./activity-report.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class ActivityReportComponent implements OnInit {
  private readonly currentDate = new Date();
  readonly days = signal<number[]>([]);
  readonly workedDays = signal<boolean[]>([]);
  private readonly _exportFormat = signal<'excel' | 'pdf'>('pdf');
  readonly exportControl = new FormControl<'excel' | 'pdf'>('pdf', {
    nonNullable: true,
  });
  readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Computed values
  readonly workedDaysCount = computed(() => {
    const worked = this.workedDays();
    return worked ? worked.filter((day) => day).length : 0;
  });

  readonly daysInfo = computed(() =>
    this.days().map((day) => this.getDayInfo(day))
  );

  readonly reportForm;

  constructor(private readonly fb: FormBuilder) {
    this.reportForm = this.fb.nonNullable.group({
      clientName: ['', Validators.required],
      projectName: ['', Validators.required],
      subject: ['', Validators.required],
      month: [this.currentDate.getMonth() + 1],
      year: [this.currentDate.getFullYear()],
    });

    // Watch for form changes to update calendar
    this.reportForm.valueChanges.subscribe(() => {
      this.initializeDays();
    });

    // Sync export format control with signal
    this.exportControl.valueChanges.subscribe((format) => {
      this._exportFormat.set(format);
    });
  }

  ngOnInit(): void {
    this.initializeDays();
  }

  private initializeDays(): void {
    const year = this.reportForm.get('year')?.value;
    const month = this.reportForm.get('month')?.value;

    if (!year || !month) return;

    const daysInMonth = new Date(year, month, 0).getDate();
    this.days.set(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    // Initialize worked days array if it doesn't exist or has wrong length
    if (!this.workedDays() || this.workedDays().length !== daysInMonth) {
      this.workedDays.set(Array(daysInMonth).fill(false));
    }
  }

  private getDayInfo(day: number): DayInfo {
    const year = this.reportForm.get('year')?.value;
    const month = this.reportForm.get('month')?.value;

    if (!year || !month) {
      return { day, weekday: '', status: 'Not Worked' };
    }

    const date = new Date(year, month - 1, day);
    const worked = this.workedDays()[day - 1];

    const status: DayInfo['status'] = worked ? 'Worked' : 'Not Worked';

    return {
      day,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      status,
    };
  }

  getDayName(day: number): string {
    const year = this.reportForm.get('year')?.value;
    const month = this.reportForm.get('month')?.value;

    if (!year || !month) return '';

    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  toggleDay(index: number): void {
    const currentWorkedDays = [...this.workedDays()];
    currentWorkedDays[index] = !currentWorkedDays[index];
    this.workedDays.set(currentWorkedDays);
  }

  onRightClick(event: MouseEvent, index: number): void {
    event.preventDefault();
    // Handle right-click functionality if needed
    // For now, just toggle the day like a regular click
    this.toggleDay(index);
  }

  getDayTooltip(dayInfo: DayInfo): string {
    const status = dayInfo.status === 'Worked' ? 'Worked' : 'Not Worked';
    return `${dayInfo.weekday}, ${dayInfo.day} - ${status}`;
  }

  getFirstDayOffset(): number[] {
    const year = this.reportForm.get('year')?.value;
    const month = this.reportForm.get('month')?.value;

    if (!year || !month) return [];

    const firstDay = new Date(year, month - 1, 1).getDay();
    return Array(firstDay).fill(null);
  }

  isToday(day: number): boolean {
    const year = this.reportForm.get('year')?.value;
    const month = this.reportForm.get('month')?.value;
    const today = new Date();

    if (!year || !month) return false;

    return (
      today.getDate() === day &&
      today.getMonth() === month - 1 &&
      today.getFullYear() === year
    );
  }

  isWeekend(day: number): boolean {
    const year = this.reportForm.get('year')?.value;
    const month = this.reportForm.get('month')?.value;

    if (!year || !month) return false;

    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  }

  setExportFormat(format: 'excel' | 'pdf'): void {
    this.exportControl.setValue(format);
  }

  print(): void {
    if (this.reportForm.invalid) {
      alert('Please fill in all required fields');
      return;
    }

    const formValue = this.reportForm.getRawValue();
    const { year, month, clientName, projectName, subject } = formValue;

    if (!year || !month || !clientName || !projectName || !subject) {
      return;
    }

    const monthName = new Date(year, month - 1, 1).toLocaleString('default', {
      month: 'long',
    });

    // Get only worked days for the report
    const workedDaysInfo = this.daysInfo().filter(
      (info) => info.status === 'Worked'
    );

    if (this._exportFormat() === 'excel') {
      this.generateExcel(workedDaysInfo, monthName, {
        clientName,
        projectName,
        subject,
        year,
      });
    } else {
      this.generatePDF(workedDaysInfo, monthName, {
        clientName,
        projectName,
        subject,
        year,
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
      year: number;
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
      ['Period:', `${monthName} ${formValue.year}`],
      [],
      ['Summary'],
      ['Total Days Worked:', `${this.workedDaysCount()} days`],
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
    const fileName = `activity-report-${formValue.clientName}-${monthName}-${formValue.year}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  private generatePDF(
    workedDaysInfo: DayInfo[],
    monthName: string,
    formValue: {
      clientName: string;
      projectName: string;
      subject: string;
      year: number;
    }
  ): void {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // A4 dimensions: 210mm x 297mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;

    // Set document properties
    doc.setProperties({
      title: 'Activity Report',
      subject: formValue.subject,
      author: formValue.clientName,
      keywords: 'activity report, timesheet, calendar',
      creator: 'Activity Report Generator',
    });

    let currentY = this.drawPDFHeader(
      doc,
      pageWidth,
      monthName,
      formValue,
      margin
    );
    currentY = this.drawPDFCalendar(doc, pageWidth, margin, currentY);
    this.drawPDFFooter(doc, pageWidth, pageHeight, currentY);

    // Save the PDF
    const fileName = `activity-report-calendar-${formValue.clientName}-${monthName}-${formValue.year}.pdf`;
    doc.save(fileName);
  }

  private drawPDFHeader(
    doc: any,
    pageWidth: number,
    monthName: string,
    formValue: {
      clientName: string;
      projectName: string;
      subject: string;
      year: number;
    },
    margin: number
  ): number {
    // Header section
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('Activity Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`${monthName} ${formValue.year}`, pageWidth / 2, 30, {
      align: 'center',
    });

    // Client information section
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    let currentY = 45;

    doc.setFont('helvetica', 'bold');
    doc.text('Client Information', margin, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.text(`Client: ${formValue.clientName}`, margin + 5, currentY);
    currentY += 5;
    doc.text(`Project: ${formValue.projectName}`, margin + 5, currentY);
    currentY += 5;
    doc.text(`Subject: ${formValue.subject}`, margin + 5, currentY);
    currentY += 10;

    return currentY;
  }

  private drawPDFCalendar(
    doc: any,
    pageWidth: number,
    margin: number,
    startY: number
  ): number {
    const contentWidth = pageWidth - margin * 2;
    const cellWidth = contentWidth / 7;
    const cellHeight = 20;

    // Calendar section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Calendar View', margin, startY);
    let currentY = startY + 10;

    // Get calendar data
    const daysInMonth = this.days().length;
    const firstDayOffset = this.getFirstDayOffset().length;

    // Draw calendar header
    this.drawCalendarHeader(doc, margin, currentY, cellWidth, cellHeight);
    currentY += cellHeight;

    // Draw calendar days
    const rowsNeeded = Math.ceil((daysInMonth + firstDayOffset) / 7);
    this.drawCalendarDays(doc, {
      margin,
      startY: currentY,
      cellWidth,
      cellHeight,
      daysInMonth,
      firstDayOffset,
      rowsNeeded,
    });
    currentY += rowsNeeded * cellHeight + 15;

    // Draw legend and summary
    currentY = this.drawLegendAndSummary(doc, margin, currentY, daysInMonth);

    return currentY;
  }

  private drawCalendarHeader(
    doc: any,
    margin: number,
    startY: number,
    cellWidth: number,
    cellHeight: number
  ): void {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(44, 62, 80);

    for (let i = 0; i < 7; i++) {
      const x = margin + i * cellWidth;
      const y = startY;

      // Header cell background
      doc.setFillColor(240, 240, 240);
      doc.rect(x, y, cellWidth, cellHeight, 'F');

      // Header cell border
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, y, cellWidth, cellHeight, 'S');

      // Day name text
      doc.setTextColor(44, 62, 80);
      doc.text(daysOfWeek[i], x + cellWidth / 2, y + cellHeight / 2 + 2, {
        align: 'center',
      });
    }
  }

  private drawCalendarDays(
    doc: any,
    config: {
      margin: number;
      startY: number;
      cellWidth: number;
      cellHeight: number;
      daysInMonth: number;
      firstDayOffset: number;
      rowsNeeded: number;
    }
  ): void {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    let dayIndex = 0;

    for (let row = 0; row < config.rowsNeeded; row++) {
      for (let col = 0; col < 7; col++) {
        const x = config.margin + col * config.cellWidth;
        const y = config.startY + row * config.cellHeight;
        const cellIndex = row * 7 + col;

        if (
          cellIndex < config.firstDayOffset ||
          dayIndex >= config.daysInMonth
        ) {
          this.drawEmptyCell(doc, x, y, config.cellWidth, config.cellHeight);
        } else {
          this.drawDayCell(
            doc,
            x,
            y,
            config.cellWidth,
            config.cellHeight,
            dayIndex + 1,
            dayIndex
          );
          dayIndex++;
        }
      }
    }
  }

  private drawEmptyCell(
    doc: any,
    x: number,
    y: number,
    cellWidth: number,
    cellHeight: number
  ): void {
    doc.setFillColor(250, 250, 250);
    doc.rect(x, y, cellWidth, cellHeight, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(x, y, cellWidth, cellHeight, 'S');
  }

  private drawDayCell(
    doc: any,
    x: number,
    y: number,
    cellWidth: number,
    cellHeight: number,
    dayNumber: number,
    dayIndex: number
  ): void {
    const isWorked = this.workedDays()[dayIndex];
    const isWeekend = this.isWeekend(dayNumber);
    const isToday = this.isToday(dayNumber);

    // Cell background color
    if (isWorked) {
      doc.setFillColor(72, 187, 120); // Green for worked days
    } else if (isWeekend) {
      doc.setFillColor(237, 242, 247); // Light gray for weekends
    } else {
      doc.setFillColor(255, 255, 255); // White for regular days
    }

    doc.rect(x, y, cellWidth, cellHeight, 'F');

    // Cell border
    if (isToday) {
      doc.setDrawColor(66, 153, 225); // Blue border for today
      doc.setLineWidth(1);
    } else {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
    }
    doc.rect(x, y, cellWidth, cellHeight, 'S');

    // Day number text
    if (isWorked) {
      doc.setTextColor(255, 255, 255); // White text on green background
    } else {
      doc.setTextColor(45, 55, 72); // Dark text
    }

    doc.setFont('helvetica', isToday ? 'bold' : 'normal');
    doc.text(dayNumber.toString(), x + cellWidth / 2, y + cellHeight / 2 + 2, {
      align: 'center',
    });
  }

  private drawLegendAndSummary(
    doc: any,
    margin: number,
    startY: number,
    daysInMonth: number
  ): number {
    // Legend section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text('Legend:', margin, startY);

    // Legend items
    const legendItems = [
      { color: [72, 187, 120], text: 'Worked Days' },
      { color: [237, 242, 247], text: 'Weekends' },
      { color: [255, 255, 255], text: 'Regular Days' },
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    legendItems.forEach((item, index) => {
      const legendItemY = startY + 8 + index * 8;

      // Legend color box
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(margin + 5, legendItemY - 3, 8, 5, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin + 5, legendItemY - 3, 8, 5, 'S');

      // Legend text
      doc.setTextColor(45, 55, 72);
      doc.text(item.text, margin + 18, legendItemY);
    });

    // Summary section
    const summaryY = startY + 35;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text('Summary:', margin, summaryY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(
      `Total Days Worked: ${this.workedDaysCount()} days`,
      margin + 5,
      summaryY + 8
    );

    return summaryY + 15;
  }

  private drawPDFFooter(
    doc: any,
    pageWidth: number,
    pageHeight: number,
    currentY: number
  ): void {
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
}
