/* tslint:disable */
/* eslint-disable */
import { ApplicationPermissions } from './application-permissions';
import { PersonViewModel } from './person-view-model';
export interface EnrolmentViewModel {
  dateOfBirth: string;
  employeeId: string;
  id?: number;
  isFaceCaptured?: boolean;
  mobileNumber: string;
  name: string;
  permissions?: null | Array<ApplicationPermissions>;
  permitTimeMinute: number;
  person?: PersonViewModel;
  roleId: number;
  roleName?: null | string;
}
