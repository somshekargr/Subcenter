import cv2
import time
import onnxruntime as ort
from caffe2.python.onnx import backend
import Face_Detector.vision.utils.box_utils_numpy as box_utils
import onnx
import numpy as np

from sort import Sort

threshold = 0.7
        
class FaceDetector():
    
    def __init__(self):
        self.bboxes = []
        self.bbox_color = (255,0,0)
        label_path = "Face_Detector/models/voc-model-labels.txt"
        onnx_path = "Face_Detector/models/onnx/version-slim-320.onnx"
        class_names = ['BACKGROUND', 'face']
        predictor = onnx.load(onnx_path)
        onnx.checker.check_model(predictor)
        onnx.helper.printable_graph(predictor.graph)
        predictor = backend.prepare(predictor, device="CPU")  # default CPU
        self.ort_session = ort.InferenceSession(onnx_path)
        self.input_name = self.ort_session.get_inputs()[0].name
        
    def predict( self, width, height, confidences, boxes, prob_threshold, iou_threshold=0.3, top_k=-1):
        boxes = boxes[0]
        confidences = confidences[0]
        picked_box_probs = []
        picked_labels = []
        for class_index in range(1, confidences.shape[1]):
            probs = confidences[:, class_index]
            mask = probs > prob_threshold
            probs = probs[mask]
            if probs.shape[0] == 0:
                continue
            subset_boxes = boxes[mask, :]
            box_probs = np.concatenate([subset_boxes, probs.reshape(-1, 1)], axis=1)
            box_probs = box_utils.hard_nms(box_probs,
                                        iou_threshold=iou_threshold,
                                        top_k=top_k,
                                        )
            picked_box_probs.append(box_probs)
            picked_labels.extend([class_index] * box_probs.shape[0])
        if not picked_box_probs:
            return np.array([]), np.array([]), np.array([])
        picked_box_probs = np.concatenate(picked_box_probs)
        picked_box_probs[:, 0] *= width
        picked_box_probs[:, 1] *= height
        picked_box_probs[:, 2] *= width
        picked_box_probs[:, 3] *= height
        return picked_box_probs[:, :4].astype(np.int32), np.array(picked_labels), picked_box_probs[:, 4]

    def detect_face( self, orig_image):
        if orig_image is None: return None
        image = orig_image.copy()
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (320, 240))
        image_mean = np.array([127, 127, 127])
        image = (image - image_mean) / 128
        image = np.transpose(image, [2, 0, 1])
        image = np.expand_dims(image, axis=0)
        image = image.astype(np.float32)
        confidences, boxes = self.ort_session.run(None, {self.input_name: image})
        boxes, labels, probs = self.predict(orig_image.shape[1], orig_image.shape[0], confidences, boxes, threshold)
        self.bboxes = boxes
        return boxes, labels, probs

cap = cv2.VideoCapture(0)  # capture from cameras

face_detector = FaceDetector()    
tracker =  Sort(use_dlib= False)

while True:
    ret, orig_image = cap.read()
    if orig_image is None:
        print("no img")
        break
    boxes, labels, probs = face_detector.detect_face(orig_image)
    # if boxes == []: continue
    detections = boxes
    for i in range(len(boxes)):
        detections[i][0] = boxes[i][0]
        detections[i][1] = boxes[i][1]
        detections[i][2] = boxes[i][0] + boxes[i][2]
        detections[i][3] = boxes[i][1] + boxes[i][3]
    
    # print(boxes)
    # print(detections)
    # detections = boxes
    
    # for box,dets in enumerate(zip(boxes,detections)):
    #     dets[0] = box[0]
    #     dets[1] = box[0] + box[2]
    #     dets[2] = box[1]
    #     dets[3] = box[1] + box[3]

    trackers = tracker.update(detections,orig_image)
    
    print(trackers)
    