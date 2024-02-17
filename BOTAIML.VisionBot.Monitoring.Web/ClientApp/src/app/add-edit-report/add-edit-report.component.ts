import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { AppConstants } from '../../constants/appConstants';
import { ReportViewModel } from '../api/models';
import { ReportService } from '../api/services';
import { noWhitespaceValidator } from '../utils/no-Whitespace-Validator';


@Component({
  selector: 'app-add-edit-report',
  templateUrl: './add-edit-report.component.html',
  styleUrls: ['./add-edit-report.component.css'],
  providers: [MessageService]
})
export class AddEditReportComponent implements OnInit {

  report: ReportViewModel;
  ReportFormGroup: FormGroup;
  result: ReportViewModel;
  RemoveSpaces: ValidatorFn;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private toastrService: ToastrService,
  ) { }

  id: number;
  isloaded = false;
  isFormPageInitialized: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = Number.parseInt(params.id || 0);
      this.loadReportDetails();
    });
  }
  get f() {
    return this.ReportFormGroup.controls;
  }

  loadReportDetails() {
    this.reportService.getReportDetails$Json({ id: this.id }).subscribe(result => {
      this.report = result.report;
      this.initializeForm();
      this.isloaded = true;
    });
  }

  initializeForm() {
    this.ReportFormGroup = this.builder.group({
      description: new FormControl(this.report.description, [Validators.required, Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")]),
      name: new FormControl(this.report.name, [Validators.required, Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")]),
      reportUrl: new FormControl(this.report.reportUrl, [Validators.required, noWhitespaceValidator]),
    });
    this.isFormPageInitialized = true;
  }

  saveReport() {
    if (this.ReportFormGroup.invalid) {
      this.ReportFormGroup.markAllAsTouched();
      return;
    }
    let report = {
      description: this.f.description.value,
      id: this.id,
      name: this.f.name.value,
      reportUrl: this.f.reportUrl.value,
    } as ReportViewModel;

    if (this.id > 0) {
      this.reportService.updateReport$Json({ body: report })
        .subscribe(() => {
          this.toastrService.success(AppConstants.reportUpdated);
          error => {
            this.toastrService.error(error.error);
          }
        });
    }
    else {
      this.reportService
        .addNewReport$Json({ body: report })
        .subscribe(() => {
          this.toastrService.success(AppConstants.reportCreated);
          error => {
            this.toastrService.error(error.error);
          }
        });
    }
  }


}

