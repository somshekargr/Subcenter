# import tensorflow as tf
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()

import numpy as np
from src import facenet
from align import detect_face
import cv2
from scipy.spatial import distance

class FaceEmbedding:

    def __init__(self):

        # some constants kept as default from facenet
        self.minsize = 20
        #threshold = [0.6, 0.7, 0.7]
        self.threshold = [0.1, 0.1, 0.1]
        self.factor = 0.709
        self.margin = 44
        self.input_image_size = 160

        self.sess = tf.Session()
        #Face-detector
        self.pnet, self.rnet, self.onet = detect_face.create_mtcnn(self.sess, 'align')

        #load Face-embedding model
        facenet.load_model("models/embedding.pb")

        # Get input and output tensors
        self.images_placeholder = tf.get_default_graph().get_tensor_by_name("input:0")
        self.embeddings = tf.get_default_graph().get_tensor_by_name("embeddings:0")
        self.phase_train_placeholder = tf.get_default_graph().get_tensor_by_name("phase_train:0")
        embedding_size = self.embeddings.get_shape()[1]

    def getFace(self, img):
        faces = []
        img_size = np.asarray(img.shape)[0:2]
        bounding_boxes, _ = detect_face.detect_face(img, self.minsize, self.pnet, self.rnet, self.onet, self.threshold, self.factor)
        if not len(bounding_boxes) == 0:
            for face in bounding_boxes:
                if face[4] > 0.30:
                    det = np.squeeze(face[0:4])
                    bb = np.zeros(4, dtype=np.int32)
                    bb[0] = np.maximum(det[0] - self.margin / 2, 0)
                    bb[1] = np.maximum(det[1] - self.margin / 2, 0)
                    bb[2] = np.minimum(det[2] + self.margin / 2, img_size[1])
                    bb[3] = np.minimum(det[3] + self.margin / 2, img_size[0])
                    cropped = img[bb[1]:bb[3], bb[0]:bb[2], :]
                    resized = cv2.resize(cropped, (self.input_image_size, self.input_image_size),interpolation=cv2.INTER_CUBIC)
                    # cv2.imshow("img", resized)
                    # cv2.waitKey(0)
                    prewhitened = facenet.prewhiten(resized)
                    faces.append({'face':resized,'rect':[bb[0],bb[1],bb[2],bb[3]],'embedding':self.getEmbedding(prewhitened)})
        return faces

    def getEmbedding(self, resized):
        reshaped = resized.reshape(-1,self.input_image_size, self.input_image_size,3)
        feed_dict = {self.images_placeholder: reshaped, self.phase_train_placeholder: False}
        embedding = self.sess.run(self.embeddings, feed_dict=feed_dict)
        return embedding

    def face_embedding(self, img):
        emb = self.getFace(img)
        for embeddings in emb:
            return (embeddings['embedding'])
            