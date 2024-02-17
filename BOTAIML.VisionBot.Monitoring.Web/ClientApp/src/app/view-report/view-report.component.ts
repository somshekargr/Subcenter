import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ReportViewModel } from '../api/models';
import { ReportService } from '../api/services';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit {

  public urlSafe: SafeResourceUrl;
  report: ReportViewModel;

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
    this.route.queryParams.subscribe(q => {
      this.id = q.id;
    });
  }

  public id: number = 0;
  public reportUrl: string = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = Number.parseInt(params.id || 0);
      this.loadReportDetails();
    });
  }

  loadReportDetails() {
    this.reportService.getReportDetails$Json({ id: this.id }).subscribe(result => {
      this.report = result.report;
      this.reportUrl = this.report.reportUrl;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportUrl);
    });
  }

}
