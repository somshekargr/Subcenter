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

import { AddEditReportViewModel } from '../models/add-edit-report-view-model';
import { Report } from '../models/report';
import { ReportViewModel } from '../models/report-view-model';
import { ReportViewModelPaginatedAndSortedResult } from '../models/report-view-model-paginated-and-sorted-result';
import { SortMeta } from '../models/sort-meta';
import { SortOrder } from '../models/sort-order';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getReport
   */
  static readonly GetReportPath = '/Report/GetReport';

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getReport$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReport$Plain$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<ReportViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.GetReportPath, 'get');
    if (params) {
      rb.query('skipRows', params.skipRows, {});
      rb.query('noOfRows', params.noOfRows, {});
      rb.query('sortField', params.sortField, {});
      rb.query('sortOrder', params.sortOrder, {});
      rb.query('multiSortMeta', params.multiSortMeta, {});
      rb.query('searchString', params.searchString, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ReportViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getReport$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReport$Plain(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<ReportViewModelPaginatedAndSortedResult> {

    return this.getReport$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<ReportViewModelPaginatedAndSortedResult>) => r.body as ReportViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getReport$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReport$Json$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<ReportViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.GetReportPath, 'get');
    if (params) {
      rb.query('skipRows', params.skipRows, {});
      rb.query('noOfRows', params.noOfRows, {});
      rb.query('sortField', params.sortField, {});
      rb.query('sortOrder', params.sortOrder, {});
      rb.query('multiSortMeta', params.multiSortMeta, {});
      rb.query('searchString', params.searchString, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ReportViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getReport$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReport$Json(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<ReportViewModelPaginatedAndSortedResult> {

    return this.getReport$Json$Response(params).pipe(
      map((r: StrictHttpResponse<ReportViewModelPaginatedAndSortedResult>) => r.body as ReportViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * Path part for operation getReportDetails
   */
  static readonly GetReportDetailsPath = '/Report/GetReportDetails/{id}';

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getReportDetails$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReportDetails$Plain$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<AddEditReportViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.GetReportDetailsPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AddEditReportViewModel>;
      })
    );
  }

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getReportDetails$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReportDetails$Plain(params: {
    id: number;
  }): Observable<AddEditReportViewModel> {

    return this.getReportDetails$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AddEditReportViewModel>) => r.body as AddEditReportViewModel)
    );
  }

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getReportDetails$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReportDetails$Json$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<AddEditReportViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.GetReportDetailsPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AddEditReportViewModel>;
      })
    );
  }

  /**
   * (Auth policies: ReportRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getReportDetails$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getReportDetails$Json(params: {
    id: number;
  }): Observable<AddEditReportViewModel> {

    return this.getReportDetails$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AddEditReportViewModel>) => r.body as AddEditReportViewModel)
    );
  }

  /**
   * Path part for operation addNewReport
   */
  static readonly AddNewReportPath = '/Report/AddNewReport';

  /**
   * (Auth policies: ReportCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addNewReport$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewReport$Plain$Response(params?: {
    body?: ReportViewModel
  }): Observable<StrictHttpResponse<Report>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.AddNewReportPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Report>;
      })
    );
  }

  /**
   * (Auth policies: ReportCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addNewReport$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewReport$Plain(params?: {
    body?: ReportViewModel
  }): Observable<Report> {

    return this.addNewReport$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Report>) => r.body as Report)
    );
  }

  /**
   * (Auth policies: ReportCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addNewReport$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewReport$Json$Response(params?: {
    body?: ReportViewModel
  }): Observable<StrictHttpResponse<Report>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.AddNewReportPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Report>;
      })
    );
  }

  /**
   * (Auth policies: ReportCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addNewReport$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewReport$Json(params?: {
    body?: ReportViewModel
  }): Observable<Report> {

    return this.addNewReport$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Report>) => r.body as Report)
    );
  }

  /**
   * Path part for operation updateReport
   */
  static readonly UpdateReportPath = '/Report/UpdateReport';

  /**
   * (Auth policies: ReportUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateReport$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateReport$Plain$Response(params?: {
    body?: ReportViewModel
  }): Observable<StrictHttpResponse<Report>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.UpdateReportPath, 'put');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Report>;
      })
    );
  }

  /**
   * (Auth policies: ReportUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateReport$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateReport$Plain(params?: {
    body?: ReportViewModel
  }): Observable<Report> {

    return this.updateReport$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Report>) => r.body as Report)
    );
  }

  /**
   * (Auth policies: ReportUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateReport$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateReport$Json$Response(params?: {
    body?: ReportViewModel
  }): Observable<StrictHttpResponse<Report>> {

    const rb = new RequestBuilder(this.rootUrl, ReportService.UpdateReportPath, 'put');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Report>;
      })
    );
  }

  /**
   * (Auth policies: ReportUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateReport$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateReport$Json(params?: {
    body?: ReportViewModel
  }): Observable<Report> {

    return this.updateReport$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Report>) => r.body as Report)
    );
  }

}
