import glob
import math
import os
import random
from copy import copy
from pathlib import Path

import sys
sys.path.append('./')

import cv2
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import torch
import yaml
from PIL import Image, ImageDraw
from scipy.signal import butter, filtfilt
from api.yolo_source.models.experimental import attempt_load
import requests

from api.yolo_source.yolo_utils.datasets import LoadStreams, LoadImages
from api.yolo_source.yolo_utils.general import check_img_size, non_max_suppression, apply_classifier, scale_coords, xyxy2xywh, \
    strip_optimizer, set_logging, increment_path
from api.yolo_source.yolo_utils.general import xywh2xyxy, xyxy2xywh
from api.yolo_source.yolo_utils.metrics import fitness
from api.yolo_source.yolo_utils.torch_utils import select_device, load_classifier, time_synchronized
from threading import Thread
from urllib import request
from requests.exceptions import Timeout

import json
import time
from itertools import chain

class FireSmokeGensetDetector():
    
    def __init__(self, camera_class, cam_list, model, server_logger, config_dir = './config.json'):
        
        self.server_logger = server_logger
        self.image_size = 640
        self.input_image_size = (640,480)
        self.ml_model = model
        self.fire_smoke_cam_list = cam_list["fire_smoke"]
        self.genset_cam_list = cam_list["genset"]
        self.camera_class = camera_class
        
        self.y_labels = {}
        self.y_confs = {}
        self.y_boxes = {}
        self.genset_status = {}
        self.previous_genset_status = {}
        self.fire_detected_for = {}
        

        with open('./config.json', 'r') as f:
           config = json.load(f)

        self.msg_interval = config["tuning"]["ssd"]["loitoring_msg_interval"]
        self.last_notified = time.time()

        self.class_threshold = config["tuning"]["yolo"]

        self.hooter_api = config["server"]["ECU"]["hooter_api"]
        self.buzzer_api = config["server"]["ECU"]["buzzer_api"]

        for cam_id in self.genset_cam_list:
            self.genset_status[cam_id] = { 1: "Closed", 2: "Closed"}
            self.previous_genset_status[cam_id] = { 1: "Closed", 2: "Closed"}
        for cam_id in self.fire_smoke_cam_list:
            self.fire_detected_for[cam_id] = 0
        self.load()

        

    def load(self):
        self.device = select_device('0')# select ---> gpu or cpu
        self.model = attempt_load(self.ml_model, map_location=self.device) # serialize into memory
        self.imgsz = check_img_size(self.image_size, s=self.model.stride.max()) # check if given size is correct as per model
        self.names = self.model.module.names if hasattr(self.model, 'module') else self.model.names
        self.colors = [[np.random.randint(0, 255) for _ in range(3)] for _ in self.names]   
        
        
        self.half = self.device.type != 'cpu'
        if self.half:
            half = True  # we will be using this flag later
            self.model.half() # to FP16
        # while True:
        img = torch.zeros((1, 3, self.image_size, self.image_size), device=self.device) # initialize image by setting up the image with same size on cuda memory
        _ = self.model(img.half() if self.half else img) if self.device.type != 'cpu' else None  # run once

    def preprocess(self, image):
        img = cv2.resize(image, self.input_image_size)
        img = img[:, :, ::-1].transpose(2, 0, 1)  # BGR to RGB
        img = np.ascontiguousarray(img)
        img = torch.from_numpy(img).to(self.device)
        img = img.half() if self.half else img.float()
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)
        return img
    
    def detect(self, image):
        Label = []
        Conf = []
        box = []
        
        img = self.preprocess(image)
        pred = self.model(img, augment=False)[0]
        pred = non_max_suppression(pred, conf_thres=.3, iou_thres=0.45, agnostic=False)
        
        for i, det in enumerate(pred):
            if det is not None and len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], image.shape).round()
                # for *xyxy, conf, cls in reversed(det):
                for *bbox, conf, cls in det:
                    label = '%s %.2f' % (self.names[int(cls)], conf)
                    split_data = label.split( )
                    label = split_data[0]
                    conf = split_data[1]
                    boxs = [int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])]
                    Label.append(label)
                    Conf.append(conf)
                    box.append(boxs)
                
            if Label !=[]:
                return Label, Conf, box
            else:
                return [], [], []
    
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
                self.yolo_detection_loop()
            except Exception as e:
                print(e)
                # print("yolo worker internal crashed... taking a five")
                # time.sleep(5)
    
    def yolo_detection_loop(self):
        result = None
        for cam_id in chain(self.genset_cam_list,self.fire_smoke_cam_list):
            
            if self.camera_class.frames[cam_id] is not None :  
                frame = self.camera_class.frames[cam_id].copy()
                inferred_image = self.camera_class.ui_frames[cam_id]
                result = self.detect(frame)
                if result is not None: 
                    self.y_labels[cam_id], self.y_confs[cam_id], self.y_boxes[cam_id] = result

            for box,label,conf in zip(self.y_boxes[cam_id],self.y_labels[cam_id],self.y_confs[cam_id]):
                
                if cam_id in self.fire_smoke_cam_list:
                    
                    if label == 'Fire' or label == 'Smoke':

                        # if float(conf) < 0.8: continue

                        if float(conf) < float(self.class_threshold[label]): continue

                        self.fire_detected_for[cam_id] += 1
                        if self.fire_detected_for[cam_id] % 900 == 0 or self.fire_detected_for[cam_id] == 5:
                            if self.fire_detected_for[cam_id] % 900: self.fire_detected_for[cam_id] = 0
                            self.server_logger.send_payload(
                                                            name = "SubCenterInside",
                                                            cameraID = 1,
                                                            isAlertRequired = True,
                                                            contentType="Image",
                                                            messageType="Telegram",
                                                            level = "warn",
                                                            message= label + " detected through "+cam_id,
                                                            cv_image=inferred_image,
                                                            trackingStatus=label,
                                                            probability= float(conf) 
                                                            )

                            requests.get(url=self.hooter_api, timeout=1)

                    else:
                        self.fire_detected_for[cam_id] += 0
                            
            
                if cam_id in self.genset_cam_list:

                    if label == 'Opened' or label == 'Closed':
                        
                        if float(conf) < float(self.class_threshold[label]): continue

                        if box[2] > 300:
                            self.genset_status[cam_id][1] = label
                        else:
                            self.genset_status[cam_id][2] = label
                    
                        for i in [1,2]:
                            if self.previous_genset_status[cam_id][i] != self.genset_status[cam_id][i]:
                                print("genset "+ str(i) + " "+ label)
                                self.previous_genset_status[cam_id][i] = self.genset_status[cam_id][i]
                                status = "Genset_Door_Open" if label == "Opened" else "Genset_Door_Close"
                                self.server_logger.send_payload(
                                                                name = "DieselArea",
                                                                cameraID = 4,
                                                                isAlertRequired = True,
                                                                contentType="Image",
                                                                messageType="Telegram",
                                                                level= "warn",
                                                                message= "Diesel genset " + str(i) + " " + label,
                                                                cv_image= inferred_image,
                                                                trackingStatus= status,
                                                                probability= float(conf) 
                                                                )

                                requests.get(url=self.buzzer_api, timeout=1)

                    if label == 'Person':
                        
                        if float(conf) < float(self.class_threshold[label]): continue

                        if int(time.time() - self.last_notified) <= self.msg_interval: continue
                        
                        self.last_notified = time.time()

                        message = "Unauthorised Loitoring at "+cam_id

                        self.server_logger.send_payload(
                            name = "DieselArea",
                            cameraID = 1,
                            isAlertRequired = True,
                            contentType="Image",
                            messageType="Telegram",
                            level = "warn",
                            trackingStatus= "Unauthorised_loitering",
                            message= message,
                            cv_image= inferred_image,
                            probability = float(conf)
                        )
                        requests.get(url=self.buzzer_api, timeout=1)
                    
                    
                        # print("person")
                            
# def main():
#     import json
#     from api.video_source import Cameras
#     from api.server_logger import ServerLogger
#     camera_details = {}

#     with open('./config.json', 'r') as f:
#         config = json.load(f)

#     for region in config["regions"]:

#         for camera in config["regions"][region]["cameras"]:

#             print(config["regions"][region]["cameras"][camera])
#             camera_details[camera] = config["regions"][region]["cameras"][camera]

#     cameras = Cameras(camera_details, skip_frame= config["tuning"]["cameras"]["skip_frames"])

#     cameras.open()
#     cameras.start()
#     server_logger = ServerLogger(config)

#     fire_genset_detector = FireSmokeGensetDetector( cameras,{"fire_smoke":["CAM-01", "CAM-02"],"genset":["CAM-04"]}, config["ml_models"]["yolo"], server_logger)

#     fire_genset_detector.start()

#     import time
    
#     while True:

#         if cameras.thread_running:
#             for cam_id in chain(fire_genset_detector.genset_cam_list, fire_genset_detector.fire_smoke_cam_list):
#                 if cameras.frames[cam_id] is not None:
#                     cv2.imshow(cam_id, cameras.frames[cam_id])
#                     cv2.waitKey(1)

            

# if __name__ == '__main__': main()