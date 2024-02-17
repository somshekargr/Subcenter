import sys
import cv2
sys.path.append('./')

from threading import Thread

class Visualization():

    def __init__(self, camera_list, camera_class, person_detector, fire_genset_detector, face_detector, websocket_handler):

        self.frames = {}

        self.thread_running = False

        self.camera_list = camera_list

        self.camera_class = camera_class

        self.person_detector = person_detector
        self.fire_genset_detector = fire_genset_detector
        self.face_detector = face_detector

        self.websocket_handler = websocket_handler

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
                self.video_loop()
            except Exception as e:
                print("Video Output crashed... taking a five")
                print(e)

    def video_loop(self):

        for cam_id in self.camera_list:
            
            if self.camera_class.ui_frames[cam_id] is not None:
                # self.frames[cam_id] = self.camera_class.frames[cam_id].copy()
                self.frames[cam_id] = self.camera_class.ui_frames[cam_id].copy()

                if cam_id in self.fire_genset_detector.y_boxes:
                    for box,label in zip(self.fire_genset_detector.y_boxes[cam_id], self.fire_genset_detector.y_labels[cam_id]):
                            cv2.rectangle(self.frames[cam_id], (box[0],box[1]), (box[2],box[3]),(255,255,0),2)
                            cv2.putText(self.frames[cam_id], label, (box[0],box[1]+50), cv2.FONT_HERSHEY_SIMPLEX,.7,255, 1)

                if cam_id in self.person_detector.track_ids:
                    for box in self.person_detector.track_ids[cam_id]:
                            
                            x1,y1,x2,y2,t = box
                            cv2.rectangle( self.frames[cam_id], (int(x1),int(y1)), (int(x2),int(y2)), (255,0,0), 2)
                            
                            if cam_id in self.face_detector.recognized_faces:
                                if t in self.face_detector.recognized_faces[cam_id]:
                                    cv2.putText( self.frames[cam_id], self.face_detector.recognized_faces[cam_id][t], (int(x1+5),int(y1+20)), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0,0,0), 2)
                                else:
                                    cv2.putText( self.frames[cam_id], str(t), (int(x1+5),int(y1+20)), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (0,0,0), 2)
                
                self.websocket_handler.frames[cam_id] = self.frames[cam_id]


# def main():
#     pass

# if __name__ == "__main__": main()

