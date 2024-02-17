import cv2
import sys
sys.path.append('./')
from api.mtcnn_source.mtcnn import TrtMtcnn
from threading import Thread
import time 
import requests
import json
import base64
from requests.exceptions import Timeout

BBOX_COLOR = (255,0,255)

class FaceDetector():

    def __init__(self, camera_list, ml_models, api_url, server_logger, config_dir= './config.json'):
        self.mtcnn = TrtMtcnn(ml_models)
        self.frames = {}
        self.boxes = {}
        self.landmarks = {}
        self.camera_list = camera_list

        self.processed_persons = {}
        self.recognized_faces = {}
        self.server_logger = server_logger

        self.open_door = False
        self.buzzer = False
        self.api_url = api_url

        with open('./config.json', 'r') as f:
            config = json.load(f)
        self.door_api = config["server"]["ECU"]["door_api"]

        for cam_id in self.camera_list:
            
            self.frames[cam_id] = {}
            self.boxes[cam_id] = []
            self.landmarks[cam_id] = []

            self.processed_persons[cam_id] = {}
            self.recognized_faces[cam_id] = {}

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
                self.mtcnn_detection_loop()
            except Exception as e:
                print(e)
                print("mtcnn worker internal crashed... taking a five")
                # time.sleep(0.5)

    def post_data(self, rest_path, data):
        try:
            url = f"{self.api_url}{rest_path}"
            request = requests.post(url, data=data, timeout = 3)
            http_status_code = request.status_code
            try:
                response = request.json()
            except:
                print(request.text)
            # print(response)
            
            if http_status_code != 200:
                
                return http_status_code, None
            else:
                return http_status_code, response  

        except Exception as e:
            print(e)
            return 555, None
            

    def mtcnn_detection_loop(self):
        for cam_id in self.camera_list:
            frames = self.frames[cam_id].copy()

            for person in frames:
                
                if frames[person] is not None:
                    frame = frames[person].copy()
                    if person in self.frames[cam_id]: del self.frames[cam_id][person]

                else:
                    continue

                if frame.shape[0] < 5 or frame.shape[1] < 5: continue
                self.boxes[cam_id], self.landmarks[cam_id] = self.mtcnn.detect(frame, minsize=40)
                
                buffer = cv2.imencode('.jpg', frame)[1].tostring()
                imageBase64 = base64.b64encode(buffer).decode("ascii")

                if self.boxes[cam_id].size < 1 : 
                    # self.frames[cam_id] = {}
                    continue
                
                # self.processed_persons

                payload = json.dumps({
                                "TrackId": person,
                                "Image": imageBase64,
                                "permission": "AreaOutsideAccess"
                            })
                http_status_code, content = self.post_data(f"?camId={cam_id}", payload)

                if http_status_code != 200:
                    print(f'FaceAPI server returned error: {http_status_code}')
                
                else:
                    if content["authperson"] is not None:
                        if float(content["trackid"]) in self.recognized_faces[content["camId"]]:continue
                        self.recognized_faces[content["camId"]][float(content["trackid"])] = content["authperson"]["name"]
                        # if content["camId"] == 'cam_3':
                        self.server_logger.send_payload(
                            name = "SubCenterDoor",
                            cameraID = 1,
                            isAlertRequired = True,
                            contentType="Image",
                            messageType="Telegram",
                            level = "warn",
                            message=content["authperson"]["name"]+ " opened the door",
                            cv_image = frame,
                            probability = content["distance"] if "distance" in content else 0
                        )
                        print("opening door for "+ content["authperson"]["name"])
                        requests.get(url=self.door_api, timeout=1)
                        

def show_faces(img, boxes, landmarks):
    """Draw bounding boxes and face landmarks on image."""
    for bb, ll in zip(boxes, landmarks):
        x1, y1, x2, y2 = int(bb[0]), int(bb[1]), int(bb[2]), int(bb[3])
        cv2.rectangle(img, (x1, y1), (x2, y2), BBOX_COLOR, 2)
        for j in range(5):
            cv2.circle(img, (int(ll[j]), int(ll[j+5])), 2, BBOX_COLOR, 2)
    return img

def main():

    import json
    from api.video_source import Cameras

    camera_details = {}

    with open('./config.json', 'r') as f:
        config = json.load(f)

    for region in config["regions"]:

        for camera in config["regions"][region]["cameras"]:

            print(config["regions"][region]["cameras"][camera])
            camera_details[camera] = config["regions"][region]["cameras"][camera]

    cameras = Cameras(camera_details, skip_frame= config["tuning"]["cameras"]["skip_frames"])

    cameras.open()
    cameras.start()
    camera_list = ['CAM-03']

    mtcnn_detector = FaceDetector(camera_list, config["ml_models"]["mtcnn"])
    mtcnn_detector.start()

    time.sleep(3)

    while True:
        for cam_id in camera_list:
            mtcnn_detector.frames[cam_id][1] = cameras.frames[cam_id]

            if len(mtcnn_detector.boxes[cam_id])<1: continue

            frame = show_faces(mtcnn_detector.frames[cam_id][1], mtcnn_detector.boxes[cam_id], mtcnn_detector.landmarks[cam_id])
            cv2.imshow("Face", frame)
            cv2.waitKey(1)
            
if __name__ == '__main__':
    main()

