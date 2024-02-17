# import tensorflow as tf
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()

import numpy as np
import cv2

class FaceDetector:
    def __init__(self, gpu_memory_fraction=0.25, visible_device_list='0'):
        
        model_path = "models/model.pb"
        with tf.io.gfile.GFile(model_path, 'rb') as f:
            graph_def = tf.GraphDef()
            graph_def.ParseFromString(f.read())

        graph = tf.Graph()
        with graph.as_default():
            tf.import_graph_def(graph_def, name='import')

        self.input_image = graph.get_tensor_by_name('import/image_tensor:0')
        self.output_ops = [
            graph.get_tensor_by_name('import/boxes:0'),
            graph.get_tensor_by_name('import/scores:0'),
            graph.get_tensor_by_name('import/num_boxes:0'),
        ]

        gpu_options = tf.GPUOptions(
            per_process_gpu_memory_fraction=gpu_memory_fraction,
            visible_device_list=visible_device_list
        )
        config_proto = tf.ConfigProto(gpu_options=gpu_options, log_device_placement=False)
        self.sess = tf.Session(graph=graph, config=config_proto)
        self.padding = 0.35
    def detectFace(self, image, score_threshold=0.5):
      
        image1 = image
        h, w, _ = image.shape
        image = np.expand_dims(image, 0)

        boxes, scores, num_boxes = self.sess.run(
            self.output_ops, feed_dict={self.input_image: image}
        )
        num_boxes = num_boxes[0]
        boxes = boxes[0][:num_boxes]
        scores = scores[0][:num_boxes]

        to_keep = scores > score_threshold
        boxes = boxes[to_keep]
        scores = scores[to_keep]

        scaler = np.array([h, w, h, w], dtype='float32')
        boxes = boxes * scaler

        if boxes is None:
            return None
        
        retVal = []
        for box in boxes:
            a,b,c,d = box
            xmin = int(a)
            ymin = int(b)
            xmax = int(c)
            ymax = int(d)

            h = ymax - ymin
            w = xmax - xmin

            im_w, im_h = image1.shape[:2]

            ymin = int(max(ymin - (w * self.padding), 0))
            ymax = int(min(ymax + (w * self.padding), im_w))
            xmin = int(max(xmin - (h * self.padding), 0))
            xmax = int(min(xmax + (h * self.padding), im_h))

            retVal.append((xmin, ymin, xmax - xmin, ymax - ymin))

        return retVal    

    def detectAndCropLargestFace(self, image, score_threshold=0.5):

        face_boxes = self.detectFace(image, score_threshold)

        if not face_boxes or len(face_boxes) == 0:
            return None

        xmin, ymin, width, height = max(face_boxes, key=lambda b: b[2]*b[3])
     
        xmin = int(xmin)
        ymin = int(ymin)
        xmax = int(xmin + width)
        ymax = int(ymin + height)

        h = ymax - ymin
        w = xmax - xmin
        im_w, im_h = image.shape[:2]

        cropped_face = image[ymin:ymax, xmin:xmax]
        # crp_img = cropped_face[:, :, ::-1]
        img = cv2.resize(cropped_face, (224, 224))
        # cv2.imshow('CroppedImage', img)
        # cv2.waitKey(0)
        return img

    def detectAndCropFaces(self, image, score_threshold=0.5):

        face_boxes = self.detectFace(image, score_threshold)

        if not face_boxes or len(face_boxes) == 0:
            return None

        retVal = []

        for bbox in face_boxes:
            xmin, ymin, width, height = bbox
            xmin = int(xmin)
            ymin = int(ymin)
            xmax = int(xmin + width)
            ymax = int(ymin + height)

            h = ymax - ymin
            w = xmax - xmin
            im_w, im_h = image.shape[:2]

            cropped_face = image[ymin:ymax, xmin:xmax]

            img = cv2.resize(cropped_face, (224, 224))
            retVal.append(img)
        return retVal  
                    
             