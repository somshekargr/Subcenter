/* tslint:disable */
/* eslint-disable */
import { Person } from './person';
export interface FaceData {
  encoding: string;
  faceIndexId?: null | string;
  id?: number;
  imagePath: string;
  person?: Person;
  personId: number;
}
