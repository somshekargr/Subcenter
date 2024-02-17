/* tslint:disable */
/* eslint-disable */
import { ApplicationPermissions } from './application-permissions';
export interface UserViewModel {
  id?: number;
  name: string;
  permissions?: null | Array<ApplicationPermissions>;
  roleId: number;
  roleName?: null | string;
  username: string;
}
