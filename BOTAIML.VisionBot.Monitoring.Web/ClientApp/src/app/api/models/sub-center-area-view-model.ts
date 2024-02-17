/* tslint:disable */
/* eslint-disable */
import { AlertContentType } from './alert-content-type';
import { AlertLevel } from './alert-level';
import { AlertType } from './alert-type';
import { AreaName } from './area-name';
import { DoorStatus } from './door-status';
import { PowerStatus } from './power-status';
import { TrackingStatus } from './tracking-status';
export interface SubCenterAreaViewModel {
  cameraId: number;
  contentType?: AlertContentType;
  doorStatus?: DoorStatus;
  isAlertRequired: boolean;
  level?: AlertLevel;
  mediaFilePath?: null | string;
  message?: null | string;
  name: AreaName;
  personId?: null | number;
  powerStatus?: PowerStatus;
  probability?: null | number;
  time?: string;
  trackingStatus?: TrackingStatus;
  type?: AlertType;
}
