/* tslint:disable */
/* eslint-disable */
import { ApplicationPermissions } from './application-permissions';
import { PasswordViewModel } from './password-view-model';
export interface NewUserViewModel {
  id?: number;
  name: string;
  passwordInfo?: PasswordViewModel;
  permissions?: null | Array<ApplicationPermissions>;
  roleId: number;
  roleName?: null | string;
  username: string;
}
