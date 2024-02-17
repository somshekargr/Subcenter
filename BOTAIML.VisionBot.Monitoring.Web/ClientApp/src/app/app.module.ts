import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { JwtInterceptor } from '../app/shared/jwt.interceptor';
import { UsersService } from '../app/api/services/users.service';
import { AuthenticationService } from "../app/shared/services/authentication.service";
import { AppComponent } from './app.component';
import { SideBarComponent } from './shared/side-bar/side-bar.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ContentComponent } from './shared/content/content.component';
import { AppRoutingModule } from './app.routing';
import { LoginComponent } from './login/login.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { AlertsComponent } from './alerts/alerts.component';
import { CommonModule } from '@angular/common';
import { EnrolmentPageComponent } from './enrolment-page/enrolment-page.component';
import { FaceEnrolmentComponent } from './face-enrolment/face-enrolment.component';
import { EnrolmentsComponent } from './enrolments/enrolments.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputMaskModule } from 'primeng/inputmask';
import { UpdateDateHttpInterceptor } from './utils/update-date-interceptor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RolesComponent } from './roles/roles.component';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { SubCenterAreaLogsComponent } from './sub-center-area-logs/sub-center-area-logs.component';
import { LiveStreamComponent } from './live-stream/live-stream.component';
import { AddEditReportComponent } from './add-edit-report/add-edit-report.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { ReportComponent } from './report/report.component';
import { UsersComponent } from './users/users.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { TimeAgoExtendsPipe } from './utils/timeago.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    SideBarComponent,
    NavBarComponent,
    FooterComponent,
    ContentComponent,
    LoginComponent,
    AlertsComponent,
    FaceEnrolmentComponent,
    EnrolmentPageComponent,
    EnrolmentsComponent,
    RolesComponent,
    AddEditRoleComponent,
    SubCenterAreaLogsComponent,
    LiveStreamComponent,
    ReportComponent,
    AddEditReportComponent,
    ViewReportComponent,
    UsersComponent,
    AddEditUserComponent,
    TimeAgoExtendsPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AutoCompleteModule,
    BlockUIModule,
    ButtonModule,
    ConfirmDialogModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    InputMaskModule,
    InputTextareaModule,
    ListboxModule,
    PasswordModule,
    TableModule,
    TabViewModule,
    TabMenuModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    RadioButtonModule,
    SelectButtonModule,
    CalendarModule,
    SplitButtonModule,
    ToggleButtonModule,
    DynamicDialogModule,
    ProgressSpinnerModule,
    TooltipModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      autoDismiss: true,
    })
  ],
  providers: [
    UsersService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, { provide: HTTP_INTERCEPTORS, useClass: UpdateDateHttpInterceptor, multi: true },
    MessageService, ConfirmationService, DialogService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
