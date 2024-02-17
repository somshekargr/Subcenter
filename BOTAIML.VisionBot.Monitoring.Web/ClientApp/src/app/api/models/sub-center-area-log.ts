/* tslint:disable */
/* eslint-disable */
import { AreaName } from './area-name';
import { DoorStatus } from './door-status';
import { Person } from './person';
import { PowerStatus } from './power-status';
import { TrackingStatus } from './tracking-status';
export interface SubCenterAreaLog {
  cameraId?: number;
  doorStatus?: DoorStatus;
  id?: number;
  isAlertRequired?: boolean;
  isAlertSent?: boolean;
  name: AreaName;
  person?: Person;
  personId?: null | number;
  powerStatus?: PowerStatus;
  probability?: null | number;
  status?: TrackingStatus;
  time: string;
}
