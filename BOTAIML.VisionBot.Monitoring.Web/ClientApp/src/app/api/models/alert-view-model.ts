/* tslint:disable */
/* eslint-disable */
import { AlertContentType } from './alert-content-type';
import { AlertLevel } from './alert-level';
import { AlertType } from './alert-type';
import { AreaName } from './area-name';
import { TrackingStatus } from './tracking-status';
export interface AlertViewModel {
  contentType: AlertContentType;
  dateTimeStamp: string;
  event?: TrackingStatus;
  id?: number;
  image?: null | string;
  level: AlertLevel;
  logId: number;
  logType: AreaName;
  mediaFilePath?: null | string;
  message: string;
  type: AlertType;
}
