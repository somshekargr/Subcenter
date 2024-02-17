from enum import Enum, IntEnum
import threading
import bson
import time
from websocket import ABNF
import websocket

from datetime import datetime

class CameraManagementMessageType(IntEnum):

    Error = 0,

    CameraStartedEvent = 1,
    CameraStoppedEvent = 2,

    GetCameraLiveStatusResponse = 3,
    GetCameraLiveStatusRequest = 4,

    BeginLiveStream = 5,
    EndLiveStream = 6,

    LiveStreamData = 7,

message_types_to_retry = [
    CameraManagementMessageType.Error,
    CameraManagementMessageType.CameraStartedEvent,
    CameraManagementMessageType.CameraStoppedEvent,
    CameraManagementMessageType.GetCameraLiveStatusRequest,
    CameraManagementMessageType.GetCameraLiveStatusResponse,
    CameraManagementMessageType.BeginLiveStream,
    CameraManagementMessageType.EndLiveStream
]

class WebsocketManagement(object):
    
    def __init__( self, cam_id, api_url):

        self.cam_id = cam_id
        self.ws_server_uri = api_url+"connectionId="+self.cam_id+"&connectionType=CAMERA"
        
        self.ws = None

        self.__is_ws_connected__ = False
        self.is_camera_stopped = True
        self.is_streaming_frames = False

        self.request_handlers = {
                CameraManagementMessageType.BeginLiveStream: self._begin_live_stream,
                CameraManagementMessageType.EndLiveStream: self._end_live_stream,
                CameraManagementMessageType.GetCameraLiveStatusResponse: self._get_camera_status
            }  

        self._connect_websocket()
    
    def _get_camera_status(self, message):
        print("Server asking for live camera status\n")

        self.send_message(CameraManagementMessageType.GetCameraLiveStatusResponse, {
            'status': "Running" if not self.is_camera_stopped else "Stopped"
        })

        time_stamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        # message_type = CameraManagementMessageType.LiveStreamData

        data = {"DateTimeStamp": time_stamp}
        
        self.send_message(CameraManagementMessageType.CameraStartedEvent, data, notify = True)

    def _begin_live_stream(self, message):
        data = bson.loads(message)
        if not self.is_streaming_frames:
            self.is_streaming_frames = True

    def _end_live_stream(self, message=None):
        data = bson.loads(message)
        if self.is_streaming_frames:
            self.is_streaming_frames = False
            self.is_camera_stopped = True

    def on_camera_started(self):
        if self.is_camera_stopped:
            self.is_camera_stopped = False

            self.send_message(CameraManagementMessageType.CameraStartedEvent, {
                "DateTimeStamp": datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
            }, notify = True)

    def _connect_websocket(self):

        def _on_message(ws, message):
            data = bson.loads(message)
            print("\n Got a message from server:")
            print(data)

            if data['messageType'] in self.request_handlers.keys():
                self.request_handlers[data['messageType']](message)
        
        def _on_close(ws):

            self.__is_ws_connected__ = False
            self.__was_previously_connected__ = False
            print("Websocket Disconnected")
            
            # Wait for 1 second and then reconnect
            time.sleep(1)

            self._connect_websocket()

        def _on_open(ws):
            self.__is_ws_connected__ = True
            self.__was_previously_connected__ = True
            self.__is_initializing__ = False
            print("Websocket Connected")

        self.ws = websocket.WebSocketApp(self.ws_server_uri,
                                        on_message= _on_message,
                                        on_open= _on_open,
                                        on_close= _on_close)

        self.wst = threading.Thread(target=self.ws.run_forever, name="ws_thread_"+self.cam_id)
        self.wst.daemon = True
        self.wst.start()

    def send_message(self, message_type: CameraManagementMessageType, payload: object = None, notify = False):
    
        if self.__is_ws_connected__ == False: return
        data = {
            "messageType": message_type,
            "cameraId": self.cam_id
        }

        if payload:
            data["payload"] = payload
            try:
                self.ws.send(bson.dumps(data), opcode=ABNF.OPCODE_BINARY)
                if notify: print("message sent")
            except:
                self._connect_websocket()
                print("Websocket disconnected")
                time.sleep(2)