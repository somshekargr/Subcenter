import base64
from operator import ge
import os
import json
from io import BytesIO
from typing import List, Optional
import json
from urllib import request
import cv2
import numpy as np
from fastapi import Body, FastAPI, File
from milvus import IndexType, MetricType, Milvus, Status
from PIL import Image
from pydantic import BaseModel
from fastapi.responses import JSONResponse, RedirectResponse

from src.face_detector import FaceDetector
from src.face_match import FaceEmbedding
import time

from src.ecu_controller import EcuController
from src.web_server import ServerLogger

from src.image_quality_estimator import ImageQualityEstimator

with open('src/ecu_config.json', 'r') as f:
        config = json.load(f)

app = FastAPI(debug=True) #Initialization

class  FaceEnrollViewModel(BaseModel):
    Id:int
    Image:str

class  FaceSearchViewModel(BaseModel):
    TrackId:str
    Image:str
    permission:str 

class CollectionName(BaseModel):
    collection_name:str

image_quality = ImageQualityEstimator()
facedetector = FaceDetector()
faceembedding = FaceEmbedding()

collection_name = 'subcentre_face_embedding'
host = 'localhost'
port = '19530'  
dim = 512  
index_file_size = 1024
width, height = (640, 480)
threshold_rejection = 0.67

get_person_name_url = "http://localhost:8800/api/Roles/GetPersonPermissionViewModel"

milvus = Milvus(host, port, pool_size=10)

server_logger = ServerLogger(config)

def __face_search__(embedding):

    _, ok = milvus.has_collection(collection_name)

    if not ok:
        param = {
            'collection_name': collection_name,
            'dimension': dim,
            'index_file_size': index_file_size,
            'metric_type': MetricType.L2 
        }   

        print(milvus.create_collection(param))

        _, collection = milvus.get_collection_info(collection_name)
        print(collection)

    search_param = {
        "nprobe": 16
    }
    if embedding is not None:
        param = {
            'collection_name': collection_name,
            'query_records': embedding,
            'top_k': 10,
            'params': search_param,
        }

        status, results = milvus.search(**param)

        if not status.OK():
            print("Search failed. ", status)

    
    for n_neighbors in results:

        if n_neighbors._dis_list !=[]:
            return {
                "id": str(n_neighbors._id_list[0]),
                "distance": n_neighbors._dis_list[0]
                }
        else:
            return None

def __get_person_name(object, permission):
    
    distance = object['distance']
    if distance < threshold_rejection:
      
        # payload = {
        #     "faceIndexId": str(object['id']),
        #     "permission": permission
        # }

        permission_url = get_person_name_url+"?faceIndexId="+str(object['id'])+"&permission="+permission
        # permission_url = "http://localhost:8800/api/Roles/GetPersonPermissionViewModel?faceIndexId=1613750886297152000&permission=AreaInsideAccess"


        #Api call to fetch the person name
        # data = json.dumps(payload).encode('utf8')
        # req = request.Request(get_person_name_url, data=data, method='POST', headers={'content-type': 'application/json'})
        req = request.Request(permission_url, method='GET', headers={'content-type': 'application/json'})

        reply = request.urlopen(req)
        http_status_code = reply.getcode()
        # get_name = (response.read()).decode("utf8")
        # result = response.read().json()
        result = (reply.read()).decode("utf8")
        result = json.loads(result)

        response = {
            "name": result["name"],
            "employeeId": result["employeeId"],
            "permitTimeMinute": result["permitTimeMinute"],
            "permission": {
                "permissionName": result['permission']["permissionName"],
                "hasPermission": result['permission']['hasPermission']
            }
        }
        if http_status_code != 200:
            # content = response.read().decode(response.headers.get_content_charset())
            content = "failed to fetch from Web server "
            return http_status_code, content, distance
        else:

            return http_status_code, response, distance
    else:
        
        print (f'Face found with distance of {distance}')
        return None, None, distance

def __get_cv2_image__(imageBase64: str):

    try:
        imgData = base64.b64decode(imageBase64)
        nparr = np.fromstring(imgData, np.uint8)

        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        height = 400
        aspect_ratio = float(img.shape[1])/float(img.shape[0])
        width = height/aspect_ratio
        resize_image = cv2.resize(img, (int(height),int(width)))
        return resize_image
    except:
        return None 


@app.get('/', include_in_schema=False)
def index():
    return RedirectResponse('/docs')

@app.post('/api/face-enroll')
async def enroll_data(PersonId: int, fileInfo: List[FaceEnrollViewModel]):

    result = []
    emb_list = []
    emb = []
   
    for id, image in fileInfo:

        inference_image = __get_cv2_image__(image[1])
        image_id = id[1]

        check_for_image_quality = image_quality.check_image_quality(inference_image)

        response = (check_for_image_quality.body).decode("utf8")

        if (json.loads(response))["success"]:
            detect_face = facedetector.detectAndCropLargestFace(inference_image)

            
            if detect_face is not None:
                
                get_embeddings = faceembedding.face_embedding(detect_face)
                emb.append((get_embeddings, image_id))

                #Check if face already exist or not
                get_face_data = __face_search__(get_embeddings)

                if get_face_data is not None:
                    emb_list.append(get_face_data)
            else:
                return JSONResponse({
                    "data": None,
                    "success": False,
                    "error": "Face not found"
                    })       
        else:
            return check_for_image_quality

    #check with all distance value with threshold to restrict enrollment of the same person
    get_status = any(n['distance'] < 0.4 for n in emb_list)
    
    if get_status:

        return JSONResponse({
                "data": None,
                "success": False,
                "error": "Face is already registered"
                })       
        
    else:
        
        for em in emb:
            _, ids = milvus.insert(collection_name=collection_name, records=em[0])
           
            for id in ids:
                result.append ({"image_id": em[1], 
                                "indexid": str(id),
                                "embeddings" : str(em[0])
                })

    if result !=[]:
        return result         
       
@app.post('/api/face-search')
async def search_data(camId: str,fileInfo:FaceSearchViewModel):


    inference_image = __get_cv2_image__(fileInfo.Image)

    # cv2.imshow("inference_image", inference_image)
    # cv2.waitKey(1)

    check_for_image_quality = image_quality.check_image_quality(inference_image)

    response = (check_for_image_quality.body).decode("utf8")

    if (json.loads(response))["success"]:
        
    
        detect_face = facedetector.detectAndCropLargestFace(inference_image)
        
        if detect_face is None:
            # return ("Face not found")
            data = {
                    "trackid": fileInfo.TrackId,
                    "camId": camId,
                    "authperson": None
                }
            return data
        
        _get_embeddings = faceembedding.face_embedding(detect_face)

        get_result = __face_search__(_get_embeddings)

        if get_result is not None:
            
            http_status_code, auth_person_name, distance =  __get_person_name(get_result, fileInfo.permission)
        
            if http_status_code!= 200 or http_status_code == None:
                # return (f"API Server returned error: {http_status_code}")
                return {
                    "trackid": fileInfo.TrackId,
                    "camId": camId,
                    "authperson": None,
                    "distance": distance
                }

            else:

                data = {
                    "trackid": fileInfo.TrackId,
                    "camId": camId,
                    "authperson": auth_person_name,
                    "distance": distance
                }

                # try:
                #     message = server_logger.send_payload(
                #             name = "SubCenterOutside",
                #             cameraID = 3,
                #             isAlertRequired = False,
                #             contentType="Text",
                #             messageType="Message",
                #             probability = distance,
                #             message= "Name of the person: "+ auth_person_name,
                #         )

                #     if message["success"]:
                #         print("Name of the person is "+ auth_person_name+",with the face distance of "+ str(distance))
                
                # except Exception as e:
                #     print (e)

                return data
    else:
        return ({
            "trackid": fileInfo.TrackId,
            "camId": camId,
            "authperson": None,
            "distance": distance
        })           
           

@app.post('/api/delete-index')
async def delete_indexId(index_id:list=Body(...)):
    
    for index in index_id:
        index = int(index)
        status = milvus.delete_entity_by_id(collection_name=collection_name, id_array=[index])
        print(status)

    time.sleep(3)
    return (f"Index-ID {index_id} deleted successfully")

@app.post('/api/flush-data')
async def flush_data(col_name:CollectionName):
    collection_name = col_name.collection_name
    # print(collection_name)
    status = milvus.drop_collection(collection_name)
    if status.OK():
        return (f"Collection Name {collection_name} flushed successfully")

    else:
        return ("Please check the collection name and try again")

@app.get('/api/ecu/open-door')
async def open_door():
    ecu_controller.door_signal = True
    print("Opened door")
    return "Opened door"

@app.get('/api/ecu/sound-buzzer')
async def sound_buzzer():
    ecu_controller.buzzer_signal = True
    print("Buzzer_activated")
    return "Buzzer_activated"

@app.get('/api/ecu/sound-hooter')
async def sound_hooter():
    ecu_controller.hooter_signal = True
    print("Hooter activated")
    return "Hooter activated"


@app.get('/api/restart-webui-service')
async def restart_webui():
    os.system("echo int123$%^ | sudo -S /bin/systemctl restart subcenter_webui.service")
    return "Restaring WebUI service"


ecu_controller = EcuController(config, server_logger)

ecu_controller.start()
ecu_controller.power_ecu_start()
ecu_controller.door_ecu_start()
