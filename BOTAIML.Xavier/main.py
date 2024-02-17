import os
import time 
import json

import requests
import platform

import pycuda.autoinit

if platform.processor() != 'x86_64':
    os.chdir("/mnt/Jetson_ext/Source_code/Subcenter/BOTAIML.Xavier")


from api.ssd_source.person_detection import PersonDetector
from api.mtcnn_source.face_detect_class import FaceDetector
from api.yolo_source.genset_fire_detect_classs import FireSmokeGensetDetector

from api.server_logger import ServerLogger
# from api.logic_processor import LogicProcessor

from api.camera.video_source import Cameras
from api.visualize import Visualization
from api.websocket_connection.websocket_handler import WebsocketHandler

def main():
    #Get Details from "config.json" file
    
    if platform.processor() != 'x86_64':
        with open('./config.json', 'r') as f:
            config = json.load(f)
    
    else:
        with open('./config_x86.json', 'r') as f:
            config = json.load(f)


    #get list of all cameras with types and uri's
    camera_details = {}
    for region in config["regions"]:
        for cam_id in config["regions"][region]["cameras"]:
            camera_details[cam_id] = config["regions"][region]["cameras"][cam_id]
    print(camera_details)

    #Now that we have Camera details of all camera to be used we have to initialize camera class with this details
    cameras = Cameras(camera_details, skip_frame= config["tuning"]["cameras"]["skip_frames"])
    cameras.open()
    cameras.start()

    #Get camera list to be processed for person_detection, fire and smoke detection, genset door detection and face detection

    person_detection_camera_list = []
    face_detection_camera_list = []
    fire_smoke_genset_camera_list = {"fire_smoke":[],"genset":[]}
    camera_list=["CAM-01","CAM-02","CAM-03","CAM-04"]


    for region in config["regions"]:
        
        if config["regions"][region]["operations"]["loitoring_detection"]:
            for cam_id in config["regions"][region]["cameras"]:
                person_detection_camera_list.append(cam_id)
        
        if config["regions"][region]["operations"]["face_recognition"]:
            for cam_id in config["regions"][region]["cameras"]:
                face_detection_camera_list.append(cam_id)

        if config["regions"][region]["operations"]["fire_smoke_detection"]: #or config["regions"][region]["operations"]["genset_door_status"]:
            for cam_id in config["regions"][region]["cameras"]:
                fire_smoke_genset_camera_list["fire_smoke"].append(cam_id)
        
        if config["regions"][region]["operations"]["genset_door_status"]: 
            for cam_id in config["regions"][region]["cameras"]:
                fire_smoke_genset_camera_list["genset"].append(cam_id)
        
    print("\n Camera list for person detection")
    print(person_detection_camera_list)

    print("\n Camera list for fire smoke genst detection")
    print(fire_smoke_genset_camera_list)

    print("\n Camera list for face detection")
    print(face_detection_camera_list)

    while cameras.thread_running == False: pass

    server_logger = ServerLogger(config)

    fire_genset_detector = FireSmokeGensetDetector( cameras, fire_smoke_genset_camera_list, config["ml_models"]["yolo"], server_logger)
    fire_genset_detector.start()

    # time.sleep(3)

    person_detector = PersonDetector( cameras, person_detection_camera_list, config["ml_models"]["ssd"], server_logger)
    person_detector.start()

    # time.sleep(3)

    face_detector = FaceDetector(face_detection_camera_list, config["ml_models"]["mtcnn"], config["server"]["face_api"]["api"], server_logger)
    face_detector.start()

    # time.sleep(3)
    try:
        requests.get(url=config["server"]["web_app"]["restart_api"], timeout= 5)
    except:
        print("Failed to restart webUI service")

    websocket_handler = WebsocketHandler(camera_list, config["server"]["web_socket"]["api"])
    websocket_handler.start()

    visualize = Visualization( camera_list, cameras, person_detector, fire_genset_detector, face_detector, websocket_handler)
    visualize.start()

    
    # logic_processor = LogicProcessor(camera_list, person_detector, face_detector, fire_genset_detector, server_logger)
    # logic_processor.start()

    time.sleep(5)
    
    ssd_threshold = config["tuning"]["ssd"]["threshold"]
    
    while True:
        try:
            for cam_id in person_detector.camera_list:     

                if cameras.frames[cam_id] is not None:
                    person_detector.boxes[cam_id], person_detector.confs[cam_id], person_detector.classes[cam_id] = person_detector.trt_ssd.detect(cameras.frames[cam_id], ssd_threshold)
            
            face_detector.frames = person_detector.processed_persons

        except:
            None
    

    fire_genset_detector.stop()
    person_detector.stop()
    face_detector.stop()

    websocket_handler.stop()
    visualize.stop()

    cameras.stop()
    cameras.release()

if __name__ == '__main__' : main()
