/* tslint:disable */
/* eslint-disable */
import { PermissionViewModel } from './permission-view-model';
import { ReportPermissionViewModel } from './report-permission-view-model';
export interface PermissionsDisplayViewModel {
  applicationPermissions?: null | { [key: string]: Array<PermissionViewModel> };
  reports?: null | Array<ReportPermissionViewModel>;
}
