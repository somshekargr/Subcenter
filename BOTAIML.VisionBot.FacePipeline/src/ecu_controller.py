from requests.exceptions import Timeout
from threading import Thread
import requests
import time 
import json
import re

class EcuController():

    def __init__(self, config, server_logger):
        
        self.server_logger = server_logger

        self.door_ecu_page_api = "http://" + config['door_ecu_ip']

        self.door_open_api = config['api']['door_open']
        self.buzzer_on_api = config['api']['buzzer_on']
        self.hooter_on_api = config['api']['hooter_on']

        self.door_status_api = config['api']['door_status_api']
        self.fire_hazzard_api = config['api']['fire_hazzard_api']

        self.previous_door_status = "closed"
        self.previous_fire_status = "safe"

        self.power_ecu_page_api = "http://" + config['power_ecu_ip']
        
        self.power_source_api = config['api']['power_source_api']
        self.load_status_api = config['api']['load_status_api']

        self.previous_power_status = "Raw power ON"
        self.previous_load_status = "Running"

        self.door_signal = False
        self.buzzer_signal = False
        self.hooter_signal = False

        self.get_main_grid_api = config["api"]["get_main_grid"]
        self.get_genset_1_api = config["api"]["get_genset_1"]
        self.get_genset_2_api = config["api"]["get_genset_2"]
        self.get_load_api = config["api"]["get_load"]

        self.lowest_power_limit = config["api"]["lowest_power_limit"]
        self.lowest_load_limit = config["api"]["lowest_load_limit"]
        self.previous_power_status = "Raw power ON"
        self.previous_load_status = "Running"
        
        self.load_count = 0

        self.load_spike_limit = config["api"]["load_spike_limit"]

        self.duplicate = False

        if not self.duplicate:
            self.duplicate = True
            message = self.server_logger.send_payload(
                        name = "SubCenterInside",
                        cameraID = 1,
                        isAlertRequired = True,
                        contentType="Text",
                        messageType="Telegram",
                        level = "info",
                        message= "System restarted successfully",
                    )

            if message["success"]:
                print("Successfully restarted server")
        else:
            self.duplicate = False

    def sound_buzzer(self):
        
        try:
            for i in range(6):
                requests.get(self.door_ecu_page_api + self.buzzer_on_api, timeout=1)

        except Exception as e:
            None
            # print("buzzer exception")
            # print(e)

    def sound_hooter(self):
        
        try:
            for i in range(6):

                requests.get(self.door_ecu_page_api + self.hooter_on_api, timeout=1)

        except Exception as e:
            None
            # print("hooter exception")
            # print(e)
    
    def open_door(self):

        count = 0
        start_time = time.time()

        # while self.previous_door_status == "closed" and (time.time()-start_time) < 10:
        while (time.time()-start_time) < 10:
            # if (time.time()-start_time) > 5: break
            if count == 5000000 or count == 1:

                try:
                    requests.get(self.door_ecu_page_api + self.door_open_api, timeout=1)

                except Exception as e:
                    # print("door exception")
                    # print(e)
                    None

                count = 1
            
            count += 1

    def check_response(self, api, raw_response):
        if re.search(api, raw_response) is not None: 
            return re.search(api, raw_response).group(1)
        else:
            return None

    def power_ecu_start(self):
        self.power_thread_run = True
        self.power_thread = Thread(target=self.power_ecu_worker_internal)
        self.power_thread.start()

    def power_ecu_stop(self):
        self.power_thread_run = False
        self.power_thread_running = False
        
    def power_ecu_worker_internal(self):
        self.power_thread_running = True
        while self.power_thread_run:
            try:
                self.read_power_ecu_parameters()
            except Exception as e:
                # print(e)
                # time.sleep(0.5)
                None

    def read_power_ecu_parameters(self):
        
        try:

            power_response = requests.get(self.power_ecu_page_api, timeout = 15)
            power_raw_response = power_response.text

            main_grid_value = int(self.check_response(self.get_main_grid_api, power_raw_response))
            genset_1_value = int(self.check_response(self.get_genset_1_api, power_raw_response))
            genset_2_value = int(self.check_response(self.get_genset_2_api, power_raw_response))
            load_value = int(self.check_response(self.get_load_api, power_raw_response))

            # print(main_grid_value)
            # print(genset_1_value)
            # print(genset_2_value)
            # print(load_value)

            alert = False
            
            if (main_grid_value > self.lowest_power_limit) or (load_value > self.lowest_power_limit) or (genset_1_value > self.lowest_power_limit) or (genset_2_value > self.lowest_power_limit):                

                if (main_grid_value > genset_1_value) & (main_grid_value > genset_2_value):
                    if (main_grid_value > self.lowest_power_limit): 
                        power_source_redefined = "Raw power ON"
                        alert = True

                if (genset_1_value > main_grid_value) & (genset_1_value > genset_2_value):
                    if (genset_1_value > self.lowest_power_limit):
                        power_source_redefined = "Generator 1"
                        alert = True

                if (genset_2_value > main_grid_value) & (genset_2_value > genset_1_value):
                    if (genset_2_value > self.lowest_power_limit):
                        power_source_redefined = "Generator 2"
                        alert = True

                

                if self.previous_power_status != power_source_redefined:
                    self.previous_power_status = power_source_redefined

                    message = self.server_logger.send_payload(
                        name = "PowerGrid",
                        cameraID = 1,
                        isAlertRequired = True,
                        contentType="Text",
                        messageType="Telegram",
                        level = "info",
                        message="[ECU] Source status :"+ power_source_redefined ,
                    )

                    if message["success"]:
                        print("Success")
            
            if not alert :
                power_source_redefined = "Raw power OFF"
                alert = True

                if self.previous_power_status != power_source_redefined:
                    self.previous_power_status = power_source_redefined

                    message = self.server_logger.send_payload(
                        name = "PowerGrid",
                        cameraID = 1,
                        isAlertRequired = True,
                        contentType="Text",
                        messageType="Telegram",
                        level = "info",
                        message="[ECU] Source status : "+ power_source_redefined ,
                    )

                    if message["success"]:
                        print("Success")



            if load_value > self.lowest_load_limit:
                load_source_redefined = "Running"
            
            else:
                load_source_redefined = "Stopped"

            if self.previous_load_status != load_source_redefined:
                self.load_count+=1
                if self.load_count >= self.load_spike_limit:
                    self.previous_load_status = load_source_redefined

                    message = self.server_logger.send_payload(
                            name = "PowerGrid",
                            cameraID = 1,
                            isAlertRequired = True,
                            contentType="Text",
                            messageType="Telegram",
                            level = "info",
                            message="[ECU] Load Status : "+ load_source_redefined ,
                        )

                    if message["success"]:
                        print("Success")
                    self.load_count=0
            else:
                self.load_count=0  
            
            # self.power_source = self.check_response( self.power_source_api, power_raw_response)
            
            # if  self.previous_power_status != self.power_source:
            #     self.previous_power_status = self.power_source 
            #     print(self.previous_power_status)

            #     alert = False
            #     # power_source_redefined = "Main Power Supply" if self.power_source  == 'grid' else ( "Generator-1" if  self.power_source  == "dg_1" else "Generator-2")

            #     if self.power_source == 'grid':
            #         power_source_redefined = "Raw power ON"
            #         alert = True

            #     elif self.power_source == 'dg_1':
            #         power_source_redefined = "Generator-1"
            #         alert = True


            #     elif self.power_source == 'dg_2':
            #         power_source_redefined = "Generator-2"
            #         alert = True

            #     elif self.power_source == 'No Power':
            #         power_source_redefined = "Raw power OFF"
            #         alert = True
                
                # if alert:
                    
                #     message = self.server_logger.send_payload(
                #         name = "PowerGrid",
                #         cameraID = 1,
                #         isAlertRequired = True,
                #         contentType="Text",
                #         messageType="Telegram",
                #         level = "info",
                #         message="[ECU] Source :"+ power_source_redefined ,
                #     )

                #     if message["success"]:
                #         print("Success")

            # self.load_status = self.check_response( self.load_status_api, power_raw_response)
            
            # if  self.previous_load_status != self.load_status:
            #     self.previous_load_status = self.load_status 
            #     print(self.previous_load_status)

            #     message = self.server_logger.send_payload(
            #         name = "PowerGrid",
            #         cameraID = 1,
            #         isAlertRequired = True,
            #         contentType="Text",
            #         messageType="Telegram",
            #         level = "info",
            #         message="[ECU] Load is " + self.previous_load_status,
            #     )

            #     if message["success"]:
            #         print("Success")

        except Exception as e:
            None

    def door_ecu_start(self):
        self.door_thread_run = True
        self.door_thread = Thread(target=self.door_ecu_worker_internal)
        self.door_thread.start()

    def door_ecu_stop(self):
        self.door_thread_run = False
        self.door_thread_running = False
        
    def door_ecu_worker_internal(self):
        self.door_thread_running = True
        
        while self.door_thread_run:
            try:
                self.read_door_ecu_parameters()
            except Exception as e:
                # print(e)
                # time.sleep(0.5)
                None
        
    def read_door_ecu_parameters(self):

        try:
            
            door_response = requests.get(self.door_ecu_page_api, timeout = 10)
            door_raw_response = door_response.text
            #door_status: opened</p>
            #<p>\n fire_smoke_status: unsafe</p></body></html>'
            self.door_status = self.check_response( self.door_status_api, door_raw_response)
            
            if  self.previous_door_status != self.door_status:
                self.previous_door_status = self.door_status 

                door_status = "Open" if self.door_status == 'opened' else "Close"

                message = self.server_logger.send_payload(
                    name = "SubCenterDoor",
                    doorStatus = door_status,
                    cameraID = 3,
                    isAlertRequired = True,
                    contentType="Text",
                    messageType="Telegram",
                    level = "info",
                    message="ECU: Door " + self.door_status,
                )

                if message["success"]:
                    print("Success")
            
            self.fire_status = self.check_response( self.fire_hazzard_api, door_raw_response)

            if  self.previous_fire_status != self.fire_status:
                self.previous_fire_status = self.fire_status 

                fire_status = "safe" if self.fire_status == "unsafe" else "unsafe"

                message = self.server_logger.send_payload(
                    name = "SubCenterDoor",
                    cameraID = 3,
                    isAlertRequired = True,
                    contentType="Text",
                    messageType="Telegram",
                    level = "warn",
                    trackingStatus = "Smoke",
                    message="ECU: Fire or smoke hazzard: " +self.fire_status
                )
                

                if message["success"]:
                    print("Success")

            if self.fire_status == 'unsafe':
                self.hooter_signal = True

        except Exception as e:
            # print(e)
            None

    def start(self):
        self.run = True
        self.thread = Thread(target=self.worker_internal)
        self.thread.start()

    def stop(self):
        self.run = False
        self.running = False
        
    def worker_internal(self):
        self.running = True
        while self.run:
            try:
                self.actuate_components()
            except Exception as e:
                # print(e)
                # time.sleep(0.5)
                None

    def actuate_components(self):

        if self.buzzer_signal | self.hooter_signal | self.door_signal:
            
            if self.buzzer_signal:
                self.sound_buzzer()
                self.buzzer_signal = False

            if self.hooter_signal:
                self.sound_hooter()
                self.hooter_signal = False

            if self.door_signal:
                self.open_door()
                self.door_signal = False

        else:
            
            time.sleep(0.5)
   
# def main():
#     from web_server import ServerLogger

    
#     with open('ecu_config.json', 'r') as f:
#         config = json.load(f)

#     server_logger = ServerLogger(config)
#     ecu_controller = EcuController(config, server_logger)
    
#     ecu_controller.sound_buzzer()
#     ecu_controller.door_ecu_start()
#     ecu_controller.power_ecu_start()

#     ecu_controller.open_door()
#     time.sleep(30)
#     ecu_controller.open_door()

# if __name__ == '__main__': main()