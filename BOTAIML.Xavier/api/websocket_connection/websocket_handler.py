import sys

from api.websocket_connection.websocket_object import WebsocketManagement as WebsocketManagement1
from api.websocket_connection.websocket_object import WebsocketManagement as WebsocketManagement2
from api.websocket_connection.websocket_object import WebsocketManagement as WebsocketManagement3
from api.websocket_connection.websocket_object import WebsocketManagement as WebsocketManagement4

from api.camera.video_source import Cameras
from enum import Enum, IntEnum
from datetime import datetime

import time
import cv2
import base64
from threading import Thread

class CameraManagementMessageType(IntEnum):

    Error = 0,

    CameraStartedEvent = 1,
    CameraStoppedEvent = 2,

    GetCameraLiveStatusRequest = 3,
    GetCameraLiveStatusResponse = 4,

    BeginLiveStream = 5,
    EndLiveStream = 6,

    LiveStreamData = 7,

message_types_to_retry = [
    CameraManagementMessageType.CameraStartedEvent,
    CameraManagementMessageType.CameraStoppedEvent,
    CameraManagementMessageType.GetCameraLiveStatusRequest,
    CameraManagementMessageType.GetCameraLiveStatusResponse,
    CameraManagementMessageType.BeginLiveStream,
    CameraManagementMessageType.EndLiveStream,

    CameraManagementMessageType.Error
]

class WebsocketHandler():

    def __init__(self, camera_list, api_url):

        self.camera_list = camera_list
        self.api_url = api_url
        self.frames = {}
        self.websocket_manager = {}

        for cam_id in camera_list:
            self.frames[cam_id] = None
            self.websocket_manager[cam_id] = globals()['WebsocketManagement'+cam_id[-1]](cam_id=cam_id, api_url=api_url)
        

    def start(self):
        self.run = True
        self.thread = Thread(target=self.__worker_internal)
        self.thread.start()

    def stop(self):
        self.run = False
        self.thread_running = False
        
    def __worker_internal(self):
        self.thread_running = True
        while self.run:
            try:
                self.stream()
            except Exception as e:
                print("Websocket handler crashed... taking a five")
                print(e)

    def stream(self):
        for cam_id in self.camera_list:
            if self.frames[cam_id] is not None:
                self.websocket_manager[cam_id].on_camera_started()
                if not self.websocket_manager[cam_id].is_streaming_frames: continue
                buffer = cv2.imencode(".jpg", self.frames[cam_id])[1].tobytes()
                data = {"snapshot": base64.b64encode(buffer).decode('ascii')}
                self.websocket_manager[cam_id].send_message(CameraManagementMessageType.LiveStreamData, data)
                # cv2.imshow(cam_id, self.frames[cam_id])
                # cv2.waitKey(1)


def main():
    import json

    camera_details = {}

    with open('./config.json', 'r') as f:
        config = json.load(f)

    for region in config["regions"]:

        for camera in config["regions"][region]["cameras"]:

            print(config["regions"][region]["cameras"][camera])
            camera_details[camera] = config["regions"][region]["cameras"][camera]


    time_stamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    # message_type = CameraManagementMessageType.LiveStreamData

    data = {"DateTimeStamp": time_stamp}

    cameras = Cameras(camera_details, skip_frame= config["tuning"]["cameras"]["skip_frames"])

    cameras.open()
    cameras.start()

    camera_list = ["CAM-01","CAM-02", "CAM-03", "CAM-04"]

    websocket_handler_thread = WebsocketHandler(camera_list, api_url="ws://10.20.20.25:8800/camera_api?")

    websocket_handler_thread.start()
    while True:

        try:
            for cam_id in camera_list:
                websocket_handler_thread.frames[cam_id] = cameras.frames[cam_id]
        except:
            print("cam ID mismatch")

if __name__ == '__main__': main()
