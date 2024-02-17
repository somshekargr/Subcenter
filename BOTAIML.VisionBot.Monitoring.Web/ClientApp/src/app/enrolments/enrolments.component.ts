import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AppConstants } from '../../constants/appConstants';
import { ApplicationPermissions, EnrolmentViewModel } from '../api/models';

import { EnrolmentService } from '../api/services';
import { AppURL } from '../app.url';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AppUtils } from '../utils/app-utils';

@Component({
  selector: 'app-enrolments',
  templateUrl: './enrolments.component.html',
  styleUrls: ['./enrolments.component.css'],
})
export class EnrolmentsComponent implements OnInit {
  hasEnrolmentAddPermission: boolean = false;
  hasEnrolmentEditPermission: boolean = false;
  hasEnrolmentReadPermission: boolean = false;
  hasEnrolmentDeletePermission: boolean = false;

  constructor(
    private enrolmentService: EnrolmentService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private toastrService: ToastrService,
  ) { }

  public gridFilter: LazyLoadEvent;
  AppURL = AppURL;
  loading = true;
  cols: any[];
  enrolments: EnrolmentViewModel[]
  totalRecords: number = 0;
  getNavigationPropertyData = (data: any, column: string) =>
    AppUtils.getNavigationPropertyData(data, column)

  ngOnInit() {
    this.hasEnrolmentReadPermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentRead);
    this.hasEnrolmentAddPermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentCreate);
    this.hasEnrolmentEditPermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentUpdate);
    this.hasEnrolmentDeletePermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentDelete);

    this.loading = true
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'employeeId', header: 'Employee-ID' },
      { field: 'roleName', header: 'RoleName' },
      { field: 'dateOfBirth', header: 'Date-Of-Birth' },
      { field: 'permitTimeMinute', header: 'Time-Minute' },
      { field: 'mobileNumber', header: 'Phone' },
      { field: '', header: '' },
    ];
  }

  confirmDeleteEnrolment(id: number) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete the enrolment?",
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEnrolment(id)
      },
      reject: () => {
      }
    });
  }

  deleteEnrolment(id: number) {
    this.enrolmentService.deleteEnrolment$Response({ id }).subscribe(
      () => {
        this.toastrService.success(AppConstants.enrolmentDeleted);
        this.loadEnrolment(this.gridFilter);
      },
      error => {
        this.handleErrorResponse(error);
      }
    );
  }

  handleErrorResponse(errorResponse: any) {
    let msg = 'An error has occurred!';
    if (errorResponse.error.message) {
      msg = errorResponse.error.message;
    } else if (errorResponse.error) {
      msg = errorResponse.error;
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: msg
    });
  }

  loadEnrolment(event: LazyLoadEvent) {
    this.gridFilter = event;
    this.loading = true;
    const args = AppUtils.convertToLazyLoadArgs(event);
    this.enrolmentService.getEnrolment$Json(args).subscribe(enrolment => {
      this.enrolments = enrolment.rows;
      this.totalRecords = enrolment.totalRows;
      this.loading = false;
    });
  }

}
