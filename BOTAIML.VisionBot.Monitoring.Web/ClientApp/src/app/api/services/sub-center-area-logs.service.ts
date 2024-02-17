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

import { LogsPaginationAndSortParams } from '../models/logs-pagination-and-sort-params';
import { SubCenterAreaLogPaginatedAndSortedResult } from '../models/sub-center-area-log-paginated-and-sorted-result';
import { SubCenterAreaViewModel } from '../models/sub-center-area-view-model';

@Injectable({
  providedIn: 'root',
})
export class SubCenterAreaLogsService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getSubCenterAreaLogs
   */
  static readonly GetSubCenterAreaLogsPath = '/SubCenterAreaLogs';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSubCenterAreaLogs$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getSubCenterAreaLogs$Plain$Response(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<StrictHttpResponse<SubCenterAreaLogPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, SubCenterAreaLogsService.GetSubCenterAreaLogsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SubCenterAreaLogPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSubCenterAreaLogs$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getSubCenterAreaLogs$Plain(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<SubCenterAreaLogPaginatedAndSortedResult> {

    return this.getSubCenterAreaLogs$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<SubCenterAreaLogPaginatedAndSortedResult>) => r.body as SubCenterAreaLogPaginatedAndSortedResult)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSubCenterAreaLogs$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getSubCenterAreaLogs$Json$Response(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<StrictHttpResponse<SubCenterAreaLogPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, SubCenterAreaLogsService.GetSubCenterAreaLogsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SubCenterAreaLogPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSubCenterAreaLogs$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getSubCenterAreaLogs$Json(params?: {
    body?: LogsPaginationAndSortParams
  }): Observable<SubCenterAreaLogPaginatedAndSortedResult> {

    return this.getSubCenterAreaLogs$Json$Response(params).pipe(
      map((r: StrictHttpResponse<SubCenterAreaLogPaginatedAndSortedResult>) => r.body as SubCenterAreaLogPaginatedAndSortedResult)
    );
  }

  /**
   * Path part for operation subCenterAreaLogDetection
   */
  static readonly SubCenterAreaLogDetectionPath = '/SubCenterAreaLogs/SubCenterAreaLogDetection';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `subCenterAreaLogDetection$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  subCenterAreaLogDetection$Plain$Response(params?: {
    body?: SubCenterAreaViewModel
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, SubCenterAreaLogsService.SubCenterAreaLogDetectionPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `subCenterAreaLogDetection$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  subCenterAreaLogDetection$Plain(params?: {
    body?: SubCenterAreaViewModel
  }): Observable<number> {

    return this.subCenterAreaLogDetection$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `subCenterAreaLogDetection$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  subCenterAreaLogDetection$Json$Response(params?: {
    body?: SubCenterAreaViewModel
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, SubCenterAreaLogsService.SubCenterAreaLogDetectionPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `subCenterAreaLogDetection$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  subCenterAreaLogDetection$Json(params?: {
    body?: SubCenterAreaViewModel
  }): Observable<number> {

    return this.subCenterAreaLogDetection$Json$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

}
