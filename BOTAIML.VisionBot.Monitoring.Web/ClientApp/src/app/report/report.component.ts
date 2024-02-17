import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ApplicationPermissions, ReportViewModel } from '../api/models';
import { ReportService } from '../api/services';
import { AppURL } from '../app.url';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AppUtils } from '../utils/app-utils';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [MessageService]
})
export class ReportComponent implements OnInit {
  hasAddReportPermission : boolean = false;
  hasEditReportPermission : boolean = false;
  hasViewReportPermission : boolean = false;
  hasRunReportPermission : boolean = false;
  hasReportReadPermission : boolean= false;

  constructor(
    private reportService: ReportService,
    private authenticationService: AuthenticationService
  ) { }

  AppURL = AppURL;
  loading = true;
  cols: any[];
  reports: ReportViewModel[]
  totalRecords: number = 0;
  getNavigationPropertyData = (data: any, column: string) =>
    AppUtils.getNavigationPropertyData(data, column)

  ngOnInit() {
    this.hasReportReadPermission = this.authenticationService.hasPermission(ApplicationPermissions.ReportRead);
    this.hasAddReportPermission = this.authenticationService.hasPermission(ApplicationPermissions.ReportCreate);
    this.hasEditReportPermission = this.authenticationService.hasPermission(ApplicationPermissions.ReportUpdate);
    this.hasViewReportPermission = this.authenticationService.hasPermission(ApplicationPermissions.ReportView);
    this.hasRunReportPermission = this.authenticationService.hasPermission(ApplicationPermissions.ReportRun);
    this.loading = true
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'descrption', header: 'Description' },
      { field: 'reportUrl', header: 'Report URL' },
    ];
  }

  runReport(reportUrl: string) {
    window.open(reportUrl, "_blank")
  }

  loadReport(event: LazyLoadEvent) {
    const args = AppUtils.convertToLazyLoadArgs(event);
    this.reportService.getReport$Json(args).subscribe(report => {
      this.reports = report.rows;
      this.totalRecords = report.totalRows;
      this.loading = false;
    });
  }
}
