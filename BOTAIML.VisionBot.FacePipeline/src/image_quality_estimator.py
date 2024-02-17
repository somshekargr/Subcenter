from src.TFLiteFaceDetection import UltraLightFaceDetecion
from src.TFLiteFaceAlignment import DepthFacialLandmarks
from src import process
import pickle
from src.blur_detection import detect_blur_fft
from src.brightness_detector import BrightnessPredictor
from fastapi.responses import JSONResponse

class ImageQualityEstimator():
    def __init__(self):
        with open('models/model.pkl', 'rb') as f:
            self.s = pickle.load(f)

        self.face_detector_ = UltraLightFaceDetecion(
            "models/RFB-320.tflite", conf_threshold=0.95)
        
        self.face_alignment = DepthFacialLandmarks(
            "models/sparse_face.tflite")

        self.brightnessDetector = BrightnessPredictor()

    def predict_facepose(self, image):
        boxes = self.face_detector_.inference(image) 
        
        if boxes is not None:
            get_landmark = self.face_alignment.get_landmarks(image, boxes)
            get_pose_value = process.pose(get_landmark)
            pitch, yaw, roll = get_pose_value[0], get_pose_value[1], get_pose_value[2]
            get_pose_result = self.s.predict([(pitch, yaw, roll)])

            if get_pose_result[0] == 'straight':
                return ({
                    'success': True,
                    'error': None
                })
            else:
                return ({
                    'success': False,
                    'error': 'Face pose is not Straight'
                })    

        else:
            return ({
                'success': False,
                'error': 'Face not found in image'
            })

    def predict_blurred_image(self, image):
        get_image_blurry_status = detect_blur_fft(image)

        if get_image_blurry_status:
            return ({
                'success': True,
                'error': None
            })
        else:
            return ({
                'success': False,
                'error': 'image is Blurred'
            })

    def brightness_detector(self, image):
        get_image_brightness_status = self.brightnessDetector.face_brightness_detection(image)

        if get_image_brightness_status:
            return ({
                'success': True,
                'error': None
            })
        else:
            return ({
                'success': False,
                'error': 'image is too Bright/Dark'
            })

    def check_image_quality(self, image):
        get_blurred_image_status = self.predict_blurred_image(image)

        if not get_blurred_image_status['success']:
            return JSONResponse({
                "data": None,
                "success": False,
                "error": get_blurred_image_status['error']
            })

        else:
            get_image_brightness_status = self.brightness_detector(image)

            if not get_image_brightness_status['success']:
                return JSONResponse({
                    "data": None,
                    "success": False,
                    "error": get_image_brightness_status['error']
                })

            else:
                get_head_pose_status = self.predict_facepose(image)

                if not get_head_pose_status['success']:
                    return JSONResponse({
                        "data": None,
                        "success": False,
                        "error": get_head_pose_status['error']
                    })

                else:
                    return JSONResponse({
                        "success": True 
                    })





           


