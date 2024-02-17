/* tslint:disable */
/* eslint-disable */
import { DropDownListItem } from './drop-down-list-item';
import { UserViewModel } from './user-view-model';
export interface AddEditUserViewModel {
  roles?: null | Array<DropDownListItem>;
  user?: UserViewModel;
}
