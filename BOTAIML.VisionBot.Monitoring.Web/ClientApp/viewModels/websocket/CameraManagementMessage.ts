export class CameraManagementMessage {
  cameraId: string;
  messageType: CameraManagementMessageType;
  payload?: any;
}

export class SocketResponse {
  cameraId: string;
  source: SocketResponseSource;
  payload?: any;
}

export class SocketErrorResponse {
  cameraId: string;
  payload?: any;
}

export enum CameraManagementMessageType {

  Error = 0,

  CameraStartedEvent = 1,
  CameraStoppedEvent = 2,

  GetCameraLiveStatusRequest = 3,
  GetCameraLiveStatusResponse = 4,

  BeginLiveStream = 5,
  EndLiveStream = 6,

  LiveStreamData = 7,
}

export enum SocketResponseSource {
  Camera
}
