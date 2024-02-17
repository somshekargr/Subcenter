from threading import Thread
import pycuda.autoinit
import numpy as np
import time
import sys

sys.path.append('./')

from api.camera.video_source import Cameras
from api.ssd_source.ssd import TrtSSD

from api.sort_tracker.sort_1 import Sort as Sort_1
from api.sort_tracker.sort_2 import Sort as Sort_2
from api.sort_tracker.sort_3 import Sort as Sort_3
from api.sort_tracker.sort_4 import Sort as Sort_4
# from api.sort_tracker.sort import Sort 

from collections import OrderedDict
from requests.exceptions import Timeout
import requests
import json
# import cv2

class PersonDetector():

    def __init__(self, camera_class, camera_list, model, server_logger, config_dir = './config.json'):
        
        self.max_dict_size = 1
        input_hw = (300,300)
        self.server_logger = server_logger
        self.trt_ssd = TrtSSD(model, input_hw)
        self.camera_list = camera_list
        self.trackers = {}
        self.classes = {}
        self.confs = {}
        self.boxes = {}
        self.track_ids = {}
        self.camera_class = camera_class
        self.processed_persons = {}
        self.person_count = {}
        self.buzzer = False
        self.last_notified = {}
        self.processed_tracks = {}

        with open('./config.json', 'r') as f:
           config = json.load(f)

        self.buzzer_api = config["server"]["ECU"]["buzzer_api"]        

        self.msg_interval = config["tuning"]["ssd"]["loitoring_msg_interval"]
        self.min_track_age = config["tuning"]["ssd"]["loitoring_track_age"]

        for cam_id in camera_list:
            self.confs[cam_id] = [] 
            self.boxes[cam_id] = []
            self.classes[cam_id] = []
            self.track_ids[cam_id] = []
            self.processed_persons[cam_id] = {}
            self.person_count[cam_id] = 0
            self.processed_tracks[cam_id] = []
            self.last_notified[cam_id] = time.time()

            self.trackers[cam_id] = globals()['Sort_'+cam_id[-1]](max_age=100)

    
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
                self.person_detection_loop()
            except Exception as e:
                print(e)
                # print("person detector worker inte 10rnal crashed... taking a five")
                # time.sleep(1)

    def person_detection_loop(self):
        for cam_id in self.camera_list:
            if cam_id not in self.camera_class.frames:continue
            if self.camera_class.frames[cam_id] is not None: 
                frame = self.camera_class.frames[cam_id].copy()
                if frame is not None:
                    for _,(box,conf) in enumerate(zip(self.boxes[cam_id],self.confs[cam_id])):
                        box = list(box)
                        box.append(conf)
                        box = tuple(box)
                    
                    self.track_ids[cam_id] = self.trackers[cam_id].update(np.array(self.boxes[cam_id]), frame)

                    for track in self.track_ids[cam_id]:
                        # track_id = int(track[4].copy())
                        if len(self.processed_persons[cam_id]) > self.max_dict_size: 
                            self.processed_persons[cam_id].pop(list(self.processed_persons[cam_id])[0])

                        x1, y1, x2, y2, track_id = track
                        
                        x1 = 0 if x1-10 < 0 else int(x1-10)
                        y1 = 0 if y1-10 < 0 else int(y1-10)
                        x2 = 640 if x2+10 > 640 else int(x2+10)
                        y2 = 360 if y2+10 > 360 else int(y2+10)


                        self.processed_persons[cam_id][track_id] = frame[y1:y2, x1:x2]

                        # cv2.imshow("processed_person", self.processed_persons[cam_id][track_id])
                        # cv2.waitKey(1)

                        self.person_count[cam_id] = len(self.boxes[cam_id])

                        if track_id in self.processed_tracks[cam_id]: continue
                        if int(time.time() - self.trackers[cam_id].track_start_time[track_id]) < self.min_track_age: continue
                        if int(time.time() - self.last_notified[cam_id]) <= self.msg_interval: continue

                        self.last_notified[cam_id] = time.time()

                        if self.person_count[cam_id] < 1: continue
                        message = "Unauthorised Loitoring at "+cam_id+ ". Number of people detected :"+str(self.person_count[cam_id])
                        name = None
                        if cam_id == 'CAM-01' or cam_id == 'CAM-02':
                            name = "SubCenterInside"
                        elif cam_id == 'CAM-03':
                            name = "SubCenterOutside"
                        elif cam_id == 'CAM-04':
                            name = "DieselArea"
                        
                        self.server_logger.send_payload(
                            name = name,
                            cameraID = 1,
                            isAlertRequired = True,
                            contentType="Image",
                            messageType="Telegram",
                            level = "warn",
                            trackingStatus= "Unauthorised_loitering",
                            message= message,
                            cv_image= self.camera_class.ui_frames[cam_id],
                            probability = float(conf) 
                        )

                        self.processed_tracks[cam_id].append(track_id)
                        requests.get(url=self.buzzer_api, timeout=1)
                        
# def main():
#     import json
#     import cv2
#     import pycuda.autoinit

#     camera_details = {}
#     key = None

#     print("Initializing camera")

#     with open('./config.json', 'r') as f:
#         config = json.load(f)

#     for region in config["regions"]:

#         for cam_id in config["regions"][region]["cameras"]:

#             print(config["regions"][region]["cameras"][cam_id])
#             camera_details[cam_id] = config["regions"][region]["cameras"][cam_id]

#     cameras = Cameras(camera_details, skip_frame= config["tuning"]["cameras"]["skip_frames"])

#     person_detector = PersonDetector(camera_class=cameras, camera_list=[ "CAM-01", "CAM-02", "CAM-03"], model=config["ml_models"]["ssd"], input_hw=(300,300))

#     cameras.open()
#     cameras.start()

#     while cameras.thread_running == False: None
    
#     person_detector.start()
    
#     ssd_threshold =config["tuning"]["ssd"]["threshold"]

#     while True:

#         for cam_id in person_detector.camera_list:
#             conf = 0
            
#             if cameras.frames[cam_id] is not None:
                
#                 person_detector.boxes[cam_id], person_detector.confs[cam_id], person_detector.classes[cam_id] = person_detector.trt_ssd.detect(cameras.frames[cam_id], ssd_threshold)

#                 frame = cameras.frames[cam_id].copy()

#                 for box in person_detector.track_ids[cam_id]:
#                     x1,y1,x2,y2,t = box
#                     cv2.rectangle( frame, (int(x1),int(y1)), (int(x2),int(y2)), (255,0,0), 2)
#                     cv2.putText( frame, str(t), (int(x1+5),int(y1+20)), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0,0,0), 2)
                        
#                 cv2.imshow(cam_id, frame)
#                 key = cv2.waitKey(1)

#         if key == 27:
#             break


#     person_detector.stop()

#     cv2.destroyAllWindows()
#     cameras.stop()
#     cameras.release()

# if __name__ == '__main__':
#     main()
