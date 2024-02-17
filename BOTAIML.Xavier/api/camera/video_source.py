import cv2
import numpy as np
import threading
import subprocess

def grab_img(cam):
    skip = 0

    while cam.thread_running:
        try:
            count = 0

            if skip != 0:

                for camera in cam.capture_functions:

                    if cam.capture_functions[camera] is not None:
                        cam.capture_functions[camera].grab()

                skip -= 1
            
            else:
                skip = cam.skip_frame
                for camera in cam.capture_functions:
                    ret, frame = cam.capture_functions[camera].retrieve()
                    
                    if ret: 
                        if cam.cam_configs[camera]["type"] == "file":
                            frame = cv2.resize(frame,(cam.frame_size[0], cam.frame_size[1]))
                            cam.ui_frames[camera] = frame.copy()
                            if camera in cam.white_region:

                                # white_region = cv2.fillPoly(cam.mask.copy(), [cam.roi_mask[camera]], (255, 255, 255))
                                
                                

                                frame = cv2.bitwise_and(cam.white_region[camera].copy(), frame)
                                cam.frames[camera] =  frame
                            else:
                                cam.frames[camera] =  frame
                        else:
                            cam.ui_frames[camera] = frame.copy()

                            if camera in cam.white_region:
    
                                # white_region = cv2.fillPoly(cam.mask.copy(), [cam.roi_mask[camera]], (255, 255, 255))
                                # frame = cv2.resize(frame,(cam.frame_size[0], cam.frame_size[1]))
                                

                                frame = cv2.bitwise_and(cam.white_region[camera], frame)
                                cam.frames[camera] =  frame
                            else:
                                cam.frames[camera] =  frame

                            cam.frames[camera] = frame
                        
                        
                    else: 
                        cam.frames[camera] = None
                        break

        except Exception as e :

            print(e)
            cam.start()

def open_cam_rtsp(uri, width, height, latency):
    """Open an RTSP URI (IP CAM)."""
    gst_elements = str(subprocess.check_output('gst-inspect-1.0'))
    if 'omxh264dec' in gst_elements:
        # Use hardware H.264 decoder on Jetson platforms
        gst_str = ('rtspsrc location={} latency={} ! '
                   'rtph264depay ! h264parse ! omxh264dec ! '
                #    'rtph264depay ! h264parse ! avdec_h264 max-threads=1 ! '

                   'nvvidconv ! '
                   'video/x-raw, width=(int){}, height=(int){}, '
                   'format=(string)BGRx ! videoconvert ! '
                   'appsink max-buffers=1 drop=True').format(uri, latency, width, height)

    elif 'avdec_h264' in gst_elements:
        # Otherwise try to use the software decoder 'avdec_h264'
        # NOTE: in case resizing images is necessary, try adding
        #       a 'videoscale' into the pipeline
        gst_str = ('rtspsrc location={} latency={} ! '
                   'rtph264depay ! h264parse ! avdec_h264 ! '
                   'videoconvert ! appsink').format(uri, latency)
    else:
        raise RuntimeError('H.264 decoder not found!')
    return cv2.VideoCapture(gst_str, cv2.CAP_GSTREAMER)

class Cameras():

    def __init__(self, cam_config, skip_frame= 5, frame_size= [640, 360]):
        self.use_thread = True

        self.frames = {}
        self.capture_functions = {}
        self.camera_status = {}
        self.roi_mask = {}

        self.frame_size = frame_size

        self.cam_configs = cam_config
        self.skip_frame = skip_frame

        self.white_region = {}

        self.ui_frames = {}

        # self.mask = np.zeros((frame_size[1], frame_size[0], 3), np.uint8)
        for camera in self.cam_configs: 
            if cam_config[camera]["roi_file"] is not None : self.white_region[camera] = cam_config[camera]["roi_file"] 
            self.ui_frames[camera] = None
        # for cam_id in cam_config:
        #     self.roi[cam_id] = None

    def open(self):

        for camera in self.cam_configs:
            if self.cam_configs[camera]['type'] == "file":
            
                self.capture_functions[camera] = cv2.VideoCapture(self.cam_configs[camera]['uri'])
                self.capture_functions[camera].set(cv2.CAP_PROP_BUFFERSIZE, 3)
                self.camera_status[camera] = True

            elif self.cam_configs[camera]['type'] == "rtsp":
            
                self.capture_functions[camera] = open_cam_rtsp(self.cam_configs[camera]['uri'], self.frame_size[0], self.frame_size[1], 1)
                # self.capture_functions[camera].set(cv2.CAP_PROP_BUFFERSIZE, 1)
                self.camera_status[camera] = True
            
            else:
                raise SystemExit('ERROR: failed to open camera!')

            if self.cam_configs[camera]['roi_file'] is not None:
                # pts = []
                # saved_data = np.loadtxt(self.cam_configs[camera]['roi_file'] )
                # j = 1
                # for i in range(int(len(saved_data)/2)):
                #     pts.append((int(saved_data[j-1]),int(saved_data[j])))
                #     j += 2
                
                # points = np.array(pts, np.int32)
                # points = points.reshape((-1, 1, 2))
                self.white_region[camera] = cv2.imread(self.cam_configs[camera]['roi_file'])
                # white_region = cv2.fillPoly(self.mask.copy(), [points], (255, 255, 255))

                
                # self.roi_mask[camera] = points
            else:
                continue

    def start(self):
        # assert not self.thread_running
        if self.use_thread:
            self.thread_running = True
            self.thread = threading.Thread(target=grab_img, args=(self,))
            self.thread.start()

    def stop(self):
        self.thread_running = False
        if self.use_thread:
            self.thread.join()
            
    def release(self):
        for camera in self.capture_functions:
            self.capture_functions[camera].release()
            
# def main():
    
#     import json

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

#     import time

#     while True:

#         if cameras.thread_running:
#             for camera in cameras.frames.copy():

#                 if cameras.frames[camera] is not None:  
#                     cv2.imshow(camera, cameras.frames[camera])
#                 else:
#                     print(camera+ " failed, restarting .....")
#                     # time.sleep(2)

#                     cameras.open()
#                     cameras.stop()
#                     cameras.start()

#             key = cv2.waitKey(1)
#             if key == 27:
#                 break
                    
#     cv2.destroyAllWindows()
#     cameras.stop()
#     cameras.release()

# if __name__ == "__main__" : main()
