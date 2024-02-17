/* tslint:disable */
/* eslint-disable */
import { FaceData } from './face-data';
export interface Person {
  createdBy?: number;
  createdOn?: string;
  faceData?: null | Array<FaceData>;
  id?: number;
  isActive?: boolean;
  updatedBy?: number;
  updatedOn?: string;
}
