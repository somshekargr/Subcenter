import { SubCenterAreaLog } from './../api/models/sub-center-area-log';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AppUtils } from '../utils/app-utils';
import { SubCenterAreaLogsService } from "../api/services/sub-center-area-logs.service";
import { NgForm } from '@angular/forms';
import { LogFilterParams, LogsPaginationAndSortParams } from '../api/models';

@Component({
  selector: 'app-sub-center-area-logs',
  templateUrl: './sub-center-area-logs.component.html',
  styleUrls: ['./sub-center-area-logs.component.css']
})
export class SubCenterAreaLogsComponent implements OnInit {

  constructor(private scLogs: SubCenterAreaLogsService) {
    this.areaNames = [
      { name: 'SubCenterDoor' },
      { name: 'SubCenterInside' },
      { name: 'SubCenterOutside' },
      { name: 'DieselArea' },
      { name: 'PowerGrid' }
    ];
  }

  loading = true;
  cols: any[];
  areaNames: any[];
  logs: SubCenterAreaLog[];
  totalRecords: number = 0;
  eventGlobal: LazyLoadEvent;
  @ViewChild('subCenterLogForm', { static: true }) subCenterLogForm: NgForm;
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

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'time', header: 'Time' },
      { field: 'status', header: 'Event-Status' },
      { field: 'powerStatus', header: 'Power Status' },
    ];
    this.selectedDate = null;
  }

  onFilterChange(event) {
    this.loadDropdownLogs();
  }

  loadDropdownLogs() {
    if (this.selectedArea == null && this.selectedDate != null) {
      this.loadLogs(this.eventGlobal);
    }
    else if (this.selectedDate == null && this.selectedArea != null) {
      this.loadLogs(this.eventGlobal);
    }
    else if (this.selectedDate == null && this.selectedArea == null) {
      this.loadLogs(this.eventGlobal);
    }
    else {
      this.loadLogs(this.eventGlobal);
    }
  }

  //We are using this method when we load the Page Initialy with Pagination Value will shown in UI
  loadLogs(event: LazyLoadEvent) {
    let logFilterParam: LogFilterParams = { areas: null, date: null };
    //case when page is not yet loaded
    if (this.subCenterLogForm == undefined) {
      logFilterParam = { areas: null, date: null };
    } else {
      //page is loaded but the values are empty
      var isemptyObject = Object.keys(this.subCenterLogForm.value).length == 0;
      if (isemptyObject) {
        logFilterParam = { areas: null, date: null };
      } else {
        const cntrl = this.subCenterLogForm.controls;
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
    this.scLogs.getSubCenterAreaLogs$Json(dataToSend).subscribe(result => {
      if (result.rows.length > 0) {
        this.filterDate = result.rows[0].time;
        this.selectedDate = new Date(this.filterDate);
      }
      this.logs = result.rows;
      this.totalRecords = result.totalRows;
      this.loading = false;
    });
  }

}
