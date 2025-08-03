import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityReportComponent } from './features/activity-report/activity-report.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, ActivityReportComponent],
})
export class AppComponent {
  title = 'activity-report-generator';
}
