/* tslint:disable */
/* eslint-disable */
import { ApplicationPermissions } from './application-permissions';
export interface PermissionViewModel {

  /**
   * Long description of what action this permission allows
   */
  description?: null | string;
  permission?: ApplicationPermissions;

  /**
   * ShortName of the permission - often says what it does, e.g. Read
   */
  shortName?: null | string;
}
