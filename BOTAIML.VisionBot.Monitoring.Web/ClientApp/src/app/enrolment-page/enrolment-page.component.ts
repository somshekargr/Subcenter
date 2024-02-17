import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../constants/appConstants';
import { DropDownListItem, EnrolmentViewModel, FaceImageDataViewModel, SaveEnrolmentResultViewModel, ApplicationPermissions } from '../api/models';
import { EnrolmentService } from '../api/services';
import { AppURL } from '../app.url';
import { FaceEnrolmentComponent } from '../face-enrolment/face-enrolment.component';
import { AuthenticationService } from '../shared/services/authentication.service';
import { FaceDetectionUtils } from '../utils/face-detection-utils';

@Component({
  selector: 'app-enrolment-page',
  templateUrl: './enrolment-page.component.html',
  styleUrls: ['./enrolment-page.component.css'],
})
export class EnrolmentPageComponent implements OnInit {
  @ViewChild(FaceEnrolmentComponent, { static: false }) enrolmentComponent: FaceEnrolmentComponent;

  roles: DropDownListItem[];
  enrolment: EnrolmentViewModel;
  enrolmentPageFormGroup: FormGroup;
  faceImages: FaceImageDataViewModel[] = [];
  totalFaceImages: FaceImageDataViewModel[] = [];
  isFaceCaptured: boolean = false;
  isSaveCompleted: boolean = false;
  saveResult: SaveEnrolmentResultViewModel;
  permitTimeMinutes: any[];
  enableDelete: boolean = true;

  constructor(
    private enrolmentService: EnrolmentService,
    private router: Router,
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private toastrService: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    this.permitTimeMinutes = [
      { label: '--select--', value: '' },
      { label: '5', value: '5' },
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '30', value: '30' },
    ];
  }

  public isMediaStreamSupported = true;

  id: number;
  isloaded: boolean = false;
  isFormPageInitialized: boolean = false;
  private currentDate = moment(new Date());
  private currentYear = this.currentDate.year();
  enrolerDobYearRange = `${this.currentYear - 85}:${this.currentYear - 18}`;
  enrolerDobMaxDate = this.currentDate.subtract(18, 'years').toDate();

  hasEnrolmentAddPermission: boolean = false;
  hasEnrolmentEditPermission: boolean = false;
  hasEnrolmentReadPermission: boolean = false;

  get faceEnrolmentResult() {
    if (this.saveResult != null) {
      return this.saveResult.faceEnrolmentResult;
    }
    return null;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = Number.parseInt(params.id || 0);
      this.loadEnrolmentDetails();
    });

    setTimeout(async () => {
      this.isMediaStreamSupported = await FaceDetectionUtils.isMediaSupported();
    });

    this.hasEnrolmentReadPermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentRead);
    this.hasEnrolmentAddPermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentCreate);
    this.hasEnrolmentEditPermission = this.authenticationService.hasPermission(ApplicationPermissions.EnrolmentUpdate);
  }
  get f() {
    return this.enrolmentPageFormGroup.controls;
  }

  

  loadEnrolmentDetails() {
    this.isFaceCaptured = false;
    this.faceImages = [];
    this.enrolmentService.getEnrolmentDetails$Json({ id: this.id }).subscribe(result => {
      this.roles = result.roles;
      this.enrolment = result.enrolment;
      this.initializeForm();
      this.isloaded = true;
    });
  }

  initializeForm() {
    this.enrolmentPageFormGroup = this.builder.group({
      dateOfBirth: new FormControl((this.enrolment.id > 0) ? new Date(this.enrolment.dateOfBirth) : null, [Validators.required]),
      employeeId: new FormControl(this.enrolment.employeeId, [Validators.required, Validators.pattern("^([A-Za-z0-9]{0,})$")]),
      isFaceCaptured: new FormControl(false),
      mobileNumber: new FormControl(this.enrolment.mobileNumber, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      name: new FormControl(this.enrolment.name, [Validators.required, Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")]),
      permitTimeMinute: new FormControl((this.enrolment.id > 0) ? (this.enrolment.permitTimeMinute.toString()) : null, [Validators.required]),
      role: new FormControl((this.enrolment.id > 0) ? (this.enrolment.roleId.toString()) : null, [Validators.required]),
    });
    this.isFormPageInitialized = true;
    if (!this.enrolment.person) {
      this.enrolment.person = {
        personId: 0,
        faceImages: []
      };
    }
    this.faceImages = this.enrolment.person.faceImages || [];
  }

  async checkIfEmployeeIdExists(employeeId: string) {
    const request = new Promise<boolean>((resolve, reject) => {
      this.enrolmentService.checkIfEmployeeIdExist$Json({
        employeeId: employeeId
      }).subscribe((result) => {
        resolve(result);
      },
        (error) => {
          reject(error);
        });
    });
    return request;
  }

  async saveEnrolmentPage() {
    if (this.enrolmentPageFormGroup.invalid) {
      this.enrolmentPageFormGroup.markAllAsTouched();
      return;
    }

    let enrolment = {
      dateOfBirth: this.f.dateOfBirth.value,
      employeeId: this.f.employeeId.value,
      id: this.id,
      isFaceCaptured: this.isFaceCaptured,
      mobileNumber: this.f.mobileNumber.value,
      name: this.f.name.value,
      permitTimeMinute: Number(this.f.permitTimeMinute.value),
      roleId: Number(this.f.role.value),
      person: {
        faceImages: this.faceImages,
        personId: this.enrolment.person.personId,
      },
    } as EnrolmentViewModel;

    if (this.id > 0) {
      this.enrolmentService.updateEnrolment$Json({ body: enrolment })
        .subscribe(
          result => {
            this.saveResult = result;
            this.isSaveCompleted = true;
            this.toastrService.success(AppConstants.enrolmentUpdatedSuccessFully);
          },
          error => {
            this.toastrService.error(error.error)
          }
        );
    }
    else {
      enrolment = Object.assign({}, enrolment);
      let isEmployeeIdExist = await this.checkIfEmployeeIdExists(enrolment.employeeId);

      if (isEmployeeIdExist) {
        this.toastrService.warning('The employee Id already exists, Please add new EmployeeId!');
      } else {
        this.enrolmentService.newEnrolment$Json({ body: enrolment })
          .subscribe(
            result => {
              this.saveResult = result;
              this.isSaveCompleted = true;
              this.toastrService.success(AppConstants.enrolmentCreatedSuccessFully);
              if (this.hasEnrolmentEditPermission) {
                this.router.navigate(['/enrolment-edit/', result.id]);
              } else if (this.hasEnrolmentReadPermission) {
                this.router.navigate(['/', AppURL.SubCenterAreaLogsRead]);
              }
            },
            error => {
              this.toastrService.error(error.error);
            }
          )
      }
    }
  }

  async captureFace() {
    this.toastrService.info('Please keep your face infront of camera while capturing the face!');
    await this.enrolmentComponent.captureImages(5);
  }

 
  onFaceImagesChange(data: any) {
  }

  //Called after new enrolment or update is done to reload to the respective edit page
  reload() {
    if (this.id > 0) {
      this.loadEnrolmentDetails();
      this.saveResult = null;
      this.isSaveCompleted = false;
    } else {
      this.router.navigateByUrl(`/enrolment-edit/${this.saveResult.id}`);
    }
  }
}
