import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ActivityReportComponent } from './activity-report/activity-report.component';

@NgModule({
  declarations: [AppComponent, ActivityReportComponent],
  imports: [BrowserModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
