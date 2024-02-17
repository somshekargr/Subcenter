/* tslint:disable */
/* eslint-disable */
import { CameraComponentStatus } from './camera-component-status';
import { CameraLiveStatus } from './camera-live-status';
export interface LiveStreamViewModel {
  cameraCode?: null | string;
  cameraLiveStatus?: CameraLiveStatus;
  cameraStatus?: CameraComponentStatus;
  id?: number;
  isEnabled?: boolean;
}
