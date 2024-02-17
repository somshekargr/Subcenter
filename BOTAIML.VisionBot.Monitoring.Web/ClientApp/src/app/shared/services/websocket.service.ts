import { Injectable } from '@angular/core';
import { deserialize, serialize } from 'bson';
import { Guid } from 'guid-typescript';
import { QueueingSubject } from 'queueing-subject';
import { Observable, Subject, Subscription } from 'rxjs';
import makeWebSocketObservable, { GetWebSocketResponses, normalClosureMessage } from 'rxjs-websockets';
import { delay, retryWhen, switchMap } from 'rxjs/operators';
import { CameraManagementMessage, CameraManagementMessageType, SocketErrorResponse, SocketResponse, SocketResponseSource } from '../../../../viewModels/websocket/CameraManagementMessage';
import { AppConstants } from '../../../constants/appConstants';

declare type WebSocketPayload = string | ArrayBuffer | Blob;

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() { }

  private socket$: Observable<GetWebSocketResponses<WebSocketPayload>>;
  private messageSubscription$: Subscription;
  private input$ = new QueueingSubject<WebSocketPayload>();

  public onCameraLiveStatusResponse = new Subject<SocketResponse>();
  public onCameraStarted = new Subject<SocketResponse>();
  public onCameraStopped = new Subject<SocketResponse>();

  public onLiveStreamData = new Subject<SocketResponse>();
  public onErrorData = new Subject<SocketErrorResponse>();

  public connect(): void {
    const uri = `${AppConstants.getBaseWebSocketUrl()}/camera_ui?connectionId=${Guid.create()}&connectionType=UI`;

    this.socket$ = makeWebSocketObservable(uri);

    this.input$ = new QueueingSubject<WebSocketPayload>();

    const messages$: Observable<WebSocketPayload> = this.socket$.pipe(
      // the observable produces a value once the websocket has been opened
      switchMap((getResponses: GetWebSocketResponses) => {
        return getResponses(this.input$);
      }),
      retryWhen((errors) => errors.pipe(delay(1000))),
    );

    this.messageSubscription$ = messages$.subscribe(
      async (message: WebSocketPayload) => {
        if (message instanceof Blob) {
          const my_blob: Blob = message as Blob;

          const reader = new FileReader();

          reader.addEventListener("loadend", () => {
            const res = new Uint8Array(reader.result as ArrayBuffer);
            let message = deserialize(res) as CameraManagementMessage;
            message = this.toCamel(message);
            this.handleMessage(message);
          });
          reader.readAsArrayBuffer(my_blob);
        } else {
          console.error("Unsupported message type!");
          console.table(message);
        }
      },
      (error: Error) => {
        const { message } = error;
        if (message === normalClosureMessage) {
          console.log("server closed the websocket connection normally");
        } else {
          console.log("socket was disconnected due to error:", message);
        }
      },
      () => {
        // The clean termination only happens in response to the last
        // subscription to the observable being unsubscribed, any
        // other closure is considered an error.
        console.log("the connection was closed in response to the user");
      }
    );
  }

  toCamel(o) {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map(function (value) {
        if (typeof value === "object") {
          value = this.toCamel(value)
        }
        return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this.toCamel(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO;
  }


  private handleMessage(message: CameraManagementMessage) {
    switch (message.messageType) {
      case CameraManagementMessageType.CameraStartedEvent:
        this.onCameraStarted.next({
          cameraId: message.cameraId,
          source: SocketResponseSource.Camera,
          payload: message.payload,
        });
        break;

      case CameraManagementMessageType.CameraStoppedEvent:
        this.onCameraStopped.next({
          cameraId: message.cameraId,
          source: SocketResponseSource.Camera,
          payload: message.payload,
        });
        break;

      case CameraManagementMessageType.GetCameraLiveStatusResponse:
        this.onCameraLiveStatusResponse.next({
          cameraId: message.cameraId,
          source: SocketResponseSource.Camera,
          payload: message.payload,
        });
        break;

      case CameraManagementMessageType.LiveStreamData:
        message.payload.snapshot = `data:image/jpeg;base64,${message.payload.snapshot}`;

        this.onLiveStreamData.next({
          cameraId: message.cameraId,
          source: SocketResponseSource.Camera,
          payload: message.payload,
        });
        break;

      case CameraManagementMessageType.Error:
        this.onErrorData.next({
          cameraId: message.cameraId,
          payload: message.payload,
        });
        break;
    }
  }

  sendMessage(msg: CameraManagementMessage) {
    const blob = serialize(msg);

    this.input$.next(blob);
  }

  disconnect() {
    this.messageSubscription$.unsubscribe();
  }
}
