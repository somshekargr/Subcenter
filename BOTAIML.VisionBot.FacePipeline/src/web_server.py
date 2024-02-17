from urllib import request
from datetime import datetime
import base64
import json
import cv2

class ServerLogger():
    
    def __init__(self, config):
        self.config = config
        self.web_api = config["web_api"]["api"]
        self.web_payload = {}

    def send_payload(self, 
                     name,
                     cameraID,
                     isAlertRequired,
                     contentType,
                     messageType,
                     level,
                     message = "",
                     cv_image = None,
                     doorStatus = "NotSpecified",
                     personID = None,
                     time = "2018-01-28T18:09:27.916Z",
                     probability = 0.9,
                     powerStatus = "NotSpecified",
                     trackingStatus = "None"):
                     
        web_payload = {}
        web_payload["name"] = name
        web_payload["cameraID"] = cameraID
        web_payload["isAlertRequired"] = isAlertRequired
        web_payload["doorStatus"] = doorStatus
        web_payload["personID"] = personID
        web_payload["time"] = time
        web_payload["probability"] = probability
        web_payload["powerStatus"] = powerStatus
        web_payload["trackingStatus"] = trackingStatus

        if isAlertRequired:
            web_payload["contentType"] = contentType
            web_payload["type"] = messageType
            web_payload["level"] = level
            web_payload["message"] = message

        if contentType == "Image":
            if cv_image is not None:
                buffer = cv2.imencode('.jpg', cv_image)[1].tostring()
                imageBase64 = base64.b64encode(buffer).decode("ascii")
                web_payload["base64Data"] = imageBase64

        message = self.send_data(payload = web_payload)
        return message

    def send_data(self, payload):
        try:
            alert_data = json.dumps(payload).encode('utf8')  
            req = request.Request(url=self.web_api, data=alert_data, method='POST', headers={'content-type': 'application/json'})
            response = request.urlopen(req)

            return {"success": True}
        except:
            return {"success": False}

# def main():
#     import cv2
#     import base64
#     with open('./config.json', 'r') as f:
#         config = json.load(f)
#     server_logger = ServerLogger(config)
#     cv_image = cv2.imread("images/test_640x480.png")

#     message = server_logger.send_payload(
#         name = "SubCenterDoor",
#         cameraID = 1,
#         isAlertRequired = True,
#         contentType="Text",
#         messageType="Telegram",
#         level = "warn",
#         message="This is the message",
#         cv_image= cv_image
#     )
#     if message["success"]:
#         print("Success")

# if __name__ == '__main__' : main()