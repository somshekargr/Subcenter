import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CameraManagementMessageType, SocketErrorResponse, SocketResponse, SocketResponseSource } from '../../../viewModels/websocket/CameraManagementMessage';
import { ApplicationPermissions, CameraComponentStatus, LiveStreamViewModel } from '../api/models';
import { WebSocketService } from '../shared/services/websocket.service';
import { AuthenticatedUser } from '../shared/authenticatedUser';
import { AuthenticationService } from '../shared/services/authentication.service';
import { CameraService } from '../api/services/camera.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';



@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.css'],
  providers: [MessageService]
})
export class LiveStreamComponent implements OnInit, OnDestroy {
  hasViewLiveStreamPermission = false;
  cameraComponentStatus = CameraComponentStatus;
  enabledLiveStreams: LiveStreamViewModel[] = [];
  disabledLiveStreams: LiveStreamViewModel[] = [];
  selectedLiveStream: LiveStreamViewModel;
  public ApplicationPermissions = ApplicationPermissions;

  liveStreamDataViewModel: { header: string, snapshot: any, cameraCode: string, enabled: boolean }
    = { enabled: false, header: "", cameraCode: "", snapshot: null };

  onCameraStartedSubscribe: Subscription;
  onCameraStoppedSubscribe: Subscription;
  onCameraLiveStatusResponseSubscribe: Subscription;
  onLiveStreamDataSubscribe: Subscription;
  onErrorDataSubscribe: Subscription;

  currentUser: AuthenticatedUser;
  isLoggedIn: boolean;
  isLoggedInSubscription: Subscription;
  currentUserSubscription: Subscription;


  constructor(
    private cameraService: CameraService,
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.hasViewLiveStreamPermission = this.authenticationService.hasPermission(ApplicationPermissions.ReportView);
    this.isLoggedInSubscription = this.authenticationService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.currentUserSubscription = this.authenticationService.user$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });

    this.liveStreamDataViewModel.enabled = false;

    this.loadCameraWiseStatus();

    this.initializeWebSocket();
  }

  unsubscribeAllWebSocketEvents() {

    this.onCameraStartedSubscribe.unsubscribe();
    this.onCameraStoppedSubscribe.unsubscribe();
    this.onCameraLiveStatusResponseSubscribe.unsubscribe();
    this.onLiveStreamDataSubscribe.unsubscribe();
    this.onErrorDataSubscribe.unsubscribe();
    this.webSocketService.disconnect();
    this.enabledLiveStreams.filter(l => l.cameraLiveStatus.status == CameraComponentStatus.Running).forEach((vm) => {
      this.endLiveStream(vm.cameraCode);
    });
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
    this.unsubscribeAllWebSocketEvents();
  }

  loadCameraWiseStatus() {
    this.enabledLiveStreams = [];
    this.disabledLiveStreams = [];

    this.cameraService
      .getCameraWiseStatus$Json()
      .subscribe((liveStreams: LiveStreamViewModel[]) => {
        liveStreams.forEach((liveStream) => {
          if (liveStream.isEnabled) {
            this.enabledLiveStreams.push(liveStream);
            this.sendWebSocketRequest(
              liveStream,
              CameraManagementMessageType.GetCameraLiveStatusRequest
            );
          } else {
            this.disabledLiveStreams.push(liveStream);
          }

          this.enabledLiveStreams = this.enabledLiveStreams.sort((a, b) => a.cameraLiveStatus.status.localeCompare(b.cameraLiveStatus.status));
        });
      }
      );
  }

  initializeWebSocket() {
    var _component = this;
    this.webSocketService.connect();

    this.onCameraStartedSubscribe = this.webSocketService.onCameraStarted.subscribe(
      function (response: SocketResponse) {
        _component.handleOnCameraStarted(response);
      });

    this.onCameraStoppedSubscribe = this.webSocketService.onCameraStopped.subscribe(
      function (response: SocketResponse) {
        _component.handleOnCameraStopped(response);
      });

    this.onCameraLiveStatusResponseSubscribe = this.webSocketService.onCameraLiveStatusResponse.subscribe(
      function (response: SocketResponse) {
        _component.handleOnCameraLiveStatusResponse(response);
      });

    this.onLiveStreamDataSubscribe = this.webSocketService.onLiveStreamData.subscribe(
      function (response: SocketResponse) {
        _component.handleLiveStreamData(response);
      });

    this.onErrorDataSubscribe = this.webSocketService.onErrorData.subscribe(
      function (response: SocketErrorResponse) {
        _component.handleErorrData(response);
      });
  }

  getLiveStreamByCameraCode(cameraCode: string): LiveStreamViewModel {
    return this.enabledLiveStreams.find((ls) => ls.cameraCode === cameraCode);
  }

  setCameraLiveStatus(cameraCode: string, status: CameraComponentStatus, errorMessage?: string) {
    this.getLiveStreamByCameraCode(cameraCode).cameraLiveStatus = {
      status: status,
      errorMessage: errorMessage,
    };
  }


  handleOnCameraLiveStatusResponse(response: SocketResponse) {
    // this.messageService.add(this.getToasterMessageText(response.cameraId, response.source, response.payload.status));
    this.setCameraLiveStatus(
      response.cameraId,
      response.payload.status,
      response.payload.errorMessage
    );
  }

  handleOnCameraStarted(response: SocketResponse) {
    //todo
    let errorMessage = "";
    if (response.payload) {
      errorMessage = response.payload.errorMessage
    }
    this.toastrService.success('Camera Started!');
    this.setCameraLiveStatus(
      response.cameraId,
      CameraComponentStatus.Running,
      errorMessage
    );

    // this.webSocketService.sendMessage({
    //   cameraId: response.cameraId,
    //   messageType: CameraManagementMessageType.BeginLiveStream
    // })
  }

  handleOnCameraStopped(response: SocketResponse) {
    //todo
    let errorMessage = "";
    if (response.payload) {
      errorMessage = response.payload.errorMessage
    }
    this.setCameraLiveStatus(
      response.cameraId,
      CameraComponentStatus.Stopped,
      errorMessage
    );

    // this.webSocketService.sendMessage({
    //   cameraId: response.cameraId,
    //   messageType: CameraManagementMessageType.EndLiveStream
    // })
  }

  handleLiveStreamData(response: SocketResponse) {
    this.liveStreamDataViewModel.cameraCode = response.cameraId;
    this.liveStreamDataViewModel.snapshot = response.payload.snapshot;
    //document.getElementById('livestream-' + response.cameraId).setAttribute('src', response.payload.snapshot);
  }

  beginLiveStream(cameraCode: string) {
    this.webSocketService.sendMessage({
      cameraId: cameraCode,
      messageType: CameraManagementMessageType.BeginLiveStream
    });
  }

  endLiveStream(cameraCode: string) {
    this.webSocketService.sendMessage({
      cameraId: cameraCode,
      messageType: CameraManagementMessageType.EndLiveStream
    })
  }

  @HostListener('window:beforeunload', ['$event'])
  onBrowserClose($event: any) {
    this.unsubscribeAllWebSocketEvents();
  }

  handleErorrData(errorResponse: SocketErrorResponse) {
    let source: SocketResponseSource = errorResponse.payload.errorMessage.includes("Camera");
    let summary: string = (source == SocketResponseSource.Camera) ? "Camera Error" : "";
    let detail: string = errorResponse.payload.errorMessage;
    let messageObj =
      { severity: "error", summary: summary, detail: detail };
    this.messageService.add(messageObj);
  }

  private sendWebSocketRequest(
    liveStream: LiveStreamViewModel,
    requestType: CameraManagementMessageType,
    payload?: any
  ) {
    this.webSocketService.sendMessage({
      cameraId: liveStream.cameraCode,
      messageType: requestType,
      payload: payload,
    });
  }

  getStatusStyle(status: CameraComponentStatus) {
    if (!status)
      return "";
    return status == CameraComponentStatus.Running ? "font-weight-bold text-success" : "font-weight-bold text-danger";
  }

  getCardStyleClass(status: CameraComponentStatus) {
    if (!status)
      return "";
    return status == CameraComponentStatus.Running ? "card card-success" : "card card-warning";
  }

  getToasterMessageText(cameraId: string, source: SocketResponseSource, status: CameraComponentStatus) {
    let summary = source == SocketResponseSource.Camera ? "Camera" : " ";
    summary += " " + status;

    let detail = `Camera Id  ${cameraId}`;

    let messageObj =
      { severity: this.getSeverity(status), summary: summary, detail: detail };

    return messageObj;
  }

  getSeverity(status: CameraComponentStatus) {
    let severity = "";
    switch (status) {
      case CameraComponentStatus.Running:
        severity = "success";
        break;
      case CameraComponentStatus.Stopped:
        severity = "error";
        break;
      default:
        severity = "info";
        break;
    }
    return severity;
  }


  showModalDialog(vm: LiveStreamViewModel) {
    this.liveStreamDataViewModel.snapshot = '';
    setTimeout(() => {
      this.beginLiveStream(vm.cameraCode);
      this.selectedLiveStream = vm;
      this.liveStreamDataViewModel.cameraCode = vm.cameraCode;
      this.liveStreamDataViewModel.enabled = true;
      this.liveStreamDataViewModel.header = "LiveStream-" + vm.cameraCode;
    }, 1000);
  }

  onModalClose() {
    this.liveStreamDataViewModel.enabled = false;
    this.endLiveStream(this.liveStreamDataViewModel.cameraCode);
  }

  isUserLoggedIn() {
    if (this.currentUser) {
      if (this.isLoggedIn) {
        return this.isLoggedIn;
      }
      else {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
      }
    } else {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    }
  }

}
