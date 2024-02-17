import { Component, OnInit } from '@angular/core';
import { AlertService } from '../api/services/alert.service';
import { LazyLoadEvent } from 'primeng/api';
import { AppUtils } from '../utils/app-utils';
import { NgForm } from '@angular/forms';
import { AlertViewModel, LogFilterParams, LogsPaginationAndSortParams } from '../api/models';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  constructor(private alert: AlertService) {
    this.areaNames = [
      { name: 'SubCenterDoor' },
      { name: 'SubCenterInside' },
      { name: 'SubCenterOutside' },
      { name: 'DieselArea' },
      { name: 'PowerGrid' }
    ];
  }

  public displayModal = false;
  loading = true;
  cols: any[];
  areaNames: any[];
  logs: AlertViewModel[];
  totalRecords: number = 0;
  eventGlobal: LazyLoadEvent;
  @ViewChild('alertLogForm', { static: true }) alertLogForm: NgForm;
  filterDate: any;

  public selectedArea: any = null;
  public selectedDate: Date = new Date();
  private currentYear = this.selectedDate.getFullYear();
  minDate = new Date("2000-01-01");
  dateYearRange = `${this.minDate.getFullYear()}:${this.currentYear}`;
  maxDate = new Date();
  areaNameChanged: boolean = false;


  getNavigationPropertyData = (data: any, column: string) =>
    AppUtils.getNavigationPropertyData(data, column)

  onSubmit(form: NgForm) {
    console.log(form.value)
  }
  modelImage: string = "";
  showDialog(imageUrl: any) {
    console.log(imageUrl['target']['currentSrc']);
    this.modelImage = imageUrl['target']['currentSrc'];
    this.displayModal = true;
  }

  ngOnInit() {
    this.cols = [
      { field: 'logType', header: 'Area' },
      { field: 'contentType', header: 'ContentType' },
      { field: 'type', header: 'Alert Type' },
      { field: 'event', header: 'Event' },
      { field: 'level', header: 'Alert Level' },
      { field: 'dateTimeStamp', header: 'Alert SentTime' },
      { field: 'mediaFilePath', header: 'Alert ContentType' },
    ];
    this.selectedDate = null;
  }

  onFilterChange(event) {
    this.loadDropdownAlerts();
  }
  loadDropdownAlerts() {
    if (this.selectedArea == null && this.selectedDate != null) {
      this.loadAlerts(this.eventGlobal);
    }
    else if (this.selectedDate == null && this.selectedArea != null) {
      this.loadAlerts(this.eventGlobal);
    }
    else if (this.selectedDate == null && this.selectedArea == null) {
      this.loadAlerts(this.eventGlobal);
    }
    else {
      this.loadAlerts(this.eventGlobal);
    }
  }

  //We are using this when we load the Page Initialy with Pagination Value will shown in UI.
  loadAlerts(event: LazyLoadEvent) {
    let logFilterParam: LogFilterParams = { areas: null, date: null };
    //case when page is not yet loaded
    if (this.alertLogForm == undefined) {
      logFilterParam = { areas: null, date: null };
    } else {
      //page is loaded but the values are empty
      var isemptyObject = Object.keys(this.alertLogForm.value).length == 0;
      if (isemptyObject) {
        logFilterParam = { areas: null, date: null };
      } else {
        const cntrl = this.alertLogForm.controls;
        logFilterParam = { areas: null, date: cntrl.date.value };
        if (cntrl.area.value != null) {
          logFilterParam = { areas: cntrl.area.value.name, date: cntrl.date.value };
        }
      }
    }

    let args: any = AppUtils.convertToLazyLoadArgs(event);
    this.eventGlobal = event;
    let dataParams: LogsPaginationAndSortParams = { filter: logFilterParam, paginationAndSort: args };
    let dataToSend: any = { body: dataParams };
    this.alert.getAlerts$Json(dataToSend).subscribe(result => {
      if (result.rows.length > 0) {
        this.filterDate = result.rows[0].dateTimeStamp;
        this.selectedDate = new Date(this.filterDate);
      }
      this.logs = result.rows;
      this.totalRecords = result.totalRows;
      this.loading = false;
    });
  }

}
