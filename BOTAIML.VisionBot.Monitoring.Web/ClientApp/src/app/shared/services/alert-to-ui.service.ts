import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';         
import { HttpClient } from '@angular/common/http';
import { ReceiveAlertModel } from '../receiveAlertModel';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertToUIService {

  private connection: any = new signalR.HubConnectionBuilder().withUrl("/alertsocket")   
    .configureLogging(signalR.LogLevel.Information)
    .build();
  readonly POST_URL = "/api/alertToUI/SendRequest";

  private receivedMessageObject: ReceiveAlertModel = new ReceiveAlertModel();
  private sharedObj = new Subject<ReceiveAlertModel>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on("ReceiveOne", (area, message, level) => { this.mapReceivedMessage(area, message, level); });
    this.start();
  }

  // Strart the connection
  public async start() {
    try {
      Object.defineProperty(WebSocket, 'OPEN', { value: 1, }); 
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(area: string, message: string, level: string): void {
    this.receivedMessageObject.area = area;
    this.receivedMessageObject.message = message;
    this.receivedMessageObject.level = level;
    this.sharedObj.next(this.receivedMessageObject);
  }

  public broadcastMessage(msgDto: any) {
    this.http.post(this.POST_URL, msgDto).subscribe(data => console.log(data));
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    
  }

  public retrieveMappedObject(): Observable<ReceiveAlertModel> {
    return this.sharedObj.asObservable();
  }

}
