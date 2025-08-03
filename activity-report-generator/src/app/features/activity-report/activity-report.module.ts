import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivityReportComponent } from './activity-report.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ActivityReportComponent],
})
export class ActivityReportModule {}
