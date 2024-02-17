/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AlertViewModelPaginatedAndSortedResult } from '../models/alert-view-model-paginated-and-sorted-result';
import { LogsPaginationAndSortParams } from '../models/logs-pagination-and-sort-params';

@Injectable({
  providedIn: 'root',
})
export class AlertService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getAlerts
   */
  static readonly GetAlertsPath = '/Alert/GetAlerts';

  /**
   * (Auth policies: AlertsRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAlerts$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getAlerts$Plain$Response(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<StrictHttpResponse<AlertViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, AlertService.GetAlertsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AlertViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: AlertsRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAlerts$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getAlerts$Plain(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<AlertViewModelPaginatedAndSortedResult> {

    return this.getAlerts$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AlertViewModelPaginatedAndSortedResult>) => r.body as AlertViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * (Auth policies: AlertsRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAlerts$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getAlerts$Json$Response(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<StrictHttpResponse<AlertViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, AlertService.GetAlertsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AlertViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: AlertsRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAlerts$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getAlerts$Json(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<AlertViewModelPaginatedAndSortedResult> {

    return this.getAlerts$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AlertViewModelPaginatedAndSortedResult>) => r.body as AlertViewModelPaginatedAndSortedResult)
    );
  }

}
