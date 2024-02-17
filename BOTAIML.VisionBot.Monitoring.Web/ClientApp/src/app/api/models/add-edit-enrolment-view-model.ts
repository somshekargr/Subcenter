/* tslint:disable */
/* eslint-disable */
import { DropDownListItem } from './drop-down-list-item';
import { EnrolmentViewModel } from './enrolment-view-model';
export interface AddEditEnrolmentViewModel {
  enrolment?: EnrolmentViewModel;
  roles?: null | Array<DropDownListItem>;
}
