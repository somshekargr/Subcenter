import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertToUIService } from '../services/alert-to-ui.service';
import { ReceiveAlertModel } from '../receiveAlertModel';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements OnInit {
  constructor(private alertToUIservice: AlertToUIService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.alertToUIservice.retrieveMappedObject().subscribe((receivedObj: ReceiveAlertModel) => { this.toastMessage(receivedObj); });
  }

  clearAlertMessages(): void {
    this.messageService.clear();
  }

  toastMessage(obj: ReceiveAlertModel) {
    let newObj = new ReceiveAlertModel();
    newObj.area = obj.area;
    newObj.message = obj.message;
    newObj.level = obj.level;
    
    this.messageService.add({ severity: newObj.level, summary: newObj.message, detail: newObj.area });

    //Auto Clearing the Alert messages after 3 minute in UI.
    setTimeout(() => {
      this.clearAlertMessages();
    }, 3000);
  }
}
