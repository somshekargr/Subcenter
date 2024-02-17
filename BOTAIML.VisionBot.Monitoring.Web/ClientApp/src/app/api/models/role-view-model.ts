/* tslint:disable */
/* eslint-disable */
import { ApplicationPermissions } from './application-permissions';
export interface RoleViewModel {
  id?: number;
  name?: null | string;
  permissions?: null | Array<ApplicationPermissions>;
  reportPermissions?: null | Array<number>;
  users?: null | Array<string>;
}
