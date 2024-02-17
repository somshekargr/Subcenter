import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { AppURL } from './app.url';
import { NgModule } from '@angular/core';
import { AuthGuard } from "../app/shared/auth.guard";
import { ApplicationPermissions } from '../app/api/models/application-permissions';
import { EnrolmentPageComponent } from './enrolment-page/enrolment-page.component';
import { AlertsComponent } from './alerts/alerts.component';
import { EnrolmentsComponent } from './enrolments/enrolments.component';
import { RolesComponent } from './roles/roles.component';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { SubCenterAreaLogsComponent } from './sub-center-area-logs/sub-center-area-logs.component';
import { LiveStreamComponent } from './live-stream/live-stream.component';

import { AddEditReportComponent } from './add-edit-report/add-edit-report.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { ReportComponent } from './report/report.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: AppURL.Default,
    redirectTo: AppURL.SubCenterAreaLogsRead,
    pathMatch: 'full'
  },
  {
    path: AppURL.EnrolmentPageRead,
    component: EnrolmentPageComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.EnrolmentRead] }
  },
  {
    path: AppURL.EnrolmentAdd,
    component: EnrolmentPageComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.EnrolmentCreate] }
  },
  {
    path: AppURL.EnrolmentEdit,
    component: EnrolmentPageComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.EnrolmentUpdate] }
  },
  {
    path: AppURL.LiveStream,
    component: LiveStreamComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.ReadLiveStream] }
  },
  {
    path: AppURL.SubCenterAreaLogsRead,
    component: SubCenterAreaLogsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppURL.AlertsRead,
    component: AlertsComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.AlertsRead] }
  },

  {
    path: AppURL.EnrolmentRead,
    component: EnrolmentsComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.EnrolmentRead] }
  },
  {
    path: AppURL.RoleAdd,
    component: AddEditRoleComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.RoleRead] }
  },
  {
    path: AppURL.RoleEdit,
    component: AddEditRoleComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.RoleUpdate] }
  },
  {
    path: AppURL.RoleRead,
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.RoleRead] }
  },
  {
    path: AppURL.AddUser,
    component: AddEditUserComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.UserCreate] }
  },
  {
    path: AppURL.EditUser,
    component: AddEditUserComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.UserUpdate] }
  },
  {
    path: AppURL.UserRead,
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { permissions: [ApplicationPermissions.UserRead] }
  },
  { path: AppURL.Login, component: LoginComponent },
  { path: AppURL.ReportRead, component: ReportComponent, canActivate: [AuthGuard], data: { permissions: [ApplicationPermissions.ReportRead] } },
  { path: AppURL.ReportPage, component: AddEditReportComponent, canActivate: [AuthGuard], data: { permissions: [ApplicationPermissions.ReportCreate] } },
  { path: AppURL.AddReport, component: AddEditReportComponent, canActivate: [AuthGuard], data: { permissions: [ApplicationPermissions.ReportCreate] } },
  { path: AppURL.EditReport, component: AddEditReportComponent, canActivate: [AuthGuard], data: { permissions: [ApplicationPermissions.ReportUpdate] } },
  { path: AppURL.ViewReport, component: ViewReportComponent, canActivate: [AuthGuard], data: { permissions: [ApplicationPermissions.ReportView] } },
  { path: "**", redirectTo: AppURL.SubCenterAreaLogsRead }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], exports: [RouterModule]
})

export class AppRoutingModule { }


