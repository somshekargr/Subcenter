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

import { AddEditEnrolmentViewModel } from '../models/add-edit-enrolment-view-model';
import { EnrolmentViewModel } from '../models/enrolment-view-model';
import { EnrolmentViewModelPaginatedAndSortedResult } from '../models/enrolment-view-model-paginated-and-sorted-result';
import { PersonDetailsViewModel } from '../models/person-details-view-model';
import { SaveEnrolmentResultViewModel } from '../models/save-enrolment-result-view-model';
import { SortMeta } from '../models/sort-meta';
import { SortOrder } from '../models/sort-order';

@Injectable({
  providedIn: 'root',
})
export class EnrolmentService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getEnrolment
   */
  static readonly GetEnrolmentPath = '/Enrolment';

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEnrolment$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolment$Plain$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<EnrolmentViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetEnrolmentPath, 'get');
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
        return r as StrictHttpResponse<EnrolmentViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEnrolment$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolment$Plain(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<EnrolmentViewModelPaginatedAndSortedResult> {

    return this.getEnrolment$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<EnrolmentViewModelPaginatedAndSortedResult>) => r.body as EnrolmentViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEnrolment$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolment$Json$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<EnrolmentViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetEnrolmentPath, 'get');
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
        return r as StrictHttpResponse<EnrolmentViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEnrolment$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolment$Json(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<EnrolmentViewModelPaginatedAndSortedResult> {

    return this.getEnrolment$Json$Response(params).pipe(
      map((r: StrictHttpResponse<EnrolmentViewModelPaginatedAndSortedResult>) => r.body as EnrolmentViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * Path part for operation getEnrolmentDetails
   */
  static readonly GetEnrolmentDetailsPath = '/Enrolment/GetEnrolmentDetails/{id}';

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEnrolmentDetails$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolmentDetails$Plain$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<AddEditEnrolmentViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetEnrolmentDetailsPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AddEditEnrolmentViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEnrolmentDetails$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolmentDetails$Plain(params: {
    id: number;
  }): Observable<AddEditEnrolmentViewModel> {

    return this.getEnrolmentDetails$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AddEditEnrolmentViewModel>) => r.body as AddEditEnrolmentViewModel)
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEnrolmentDetails$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolmentDetails$Json$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<AddEditEnrolmentViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetEnrolmentDetailsPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AddEditEnrolmentViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEnrolmentDetails$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolmentDetails$Json(params: {
    id: number;
  }): Observable<AddEditEnrolmentViewModel> {

    return this.getEnrolmentDetails$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AddEditEnrolmentViewModel>) => r.body as AddEditEnrolmentViewModel)
    );
  }

  /**
   * Path part for operation newEnrolment
   */
  static readonly NewEnrolmentPath = '/Enrolment/NewEnrolment';

  /**
   * (Auth policies: EnrolmentCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `newEnrolment$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newEnrolment$Plain$Response(params?: {
    body?: EnrolmentViewModel
  }): Observable<StrictHttpResponse<SaveEnrolmentResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.NewEnrolmentPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveEnrolmentResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `newEnrolment$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newEnrolment$Plain(params?: {
    body?: EnrolmentViewModel
  }): Observable<SaveEnrolmentResultViewModel> {

    return this.newEnrolment$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<SaveEnrolmentResultViewModel>) => r.body as SaveEnrolmentResultViewModel)
    );
  }

  /**
   * (Auth policies: EnrolmentCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `newEnrolment$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newEnrolment$Json$Response(params?: {
    body?: EnrolmentViewModel
  }): Observable<StrictHttpResponse<SaveEnrolmentResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.NewEnrolmentPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveEnrolmentResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `newEnrolment$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newEnrolment$Json(params?: {
    body?: EnrolmentViewModel
  }): Observable<SaveEnrolmentResultViewModel> {

    return this.newEnrolment$Json$Response(params).pipe(
      map((r: StrictHttpResponse<SaveEnrolmentResultViewModel>) => r.body as SaveEnrolmentResultViewModel)
    );
  }

  /**
   * Path part for operation updateEnrolment
   */
  static readonly UpdateEnrolmentPath = '/Enrolment/UpdateEnrolment';

  /**
   * (Auth policies: EnrolmentUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateEnrolment$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateEnrolment$Plain$Response(params?: {
    body?: EnrolmentViewModel
  }): Observable<StrictHttpResponse<SaveEnrolmentResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.UpdateEnrolmentPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveEnrolmentResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateEnrolment$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateEnrolment$Plain(params?: {
    body?: EnrolmentViewModel
  }): Observable<SaveEnrolmentResultViewModel> {

    return this.updateEnrolment$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<SaveEnrolmentResultViewModel>) => r.body as SaveEnrolmentResultViewModel)
    );
  }

  /**
   * (Auth policies: EnrolmentUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateEnrolment$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateEnrolment$Json$Response(params?: {
    body?: EnrolmentViewModel
  }): Observable<StrictHttpResponse<SaveEnrolmentResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.UpdateEnrolmentPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveEnrolmentResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateEnrolment$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateEnrolment$Json(params?: {
    body?: EnrolmentViewModel
  }): Observable<SaveEnrolmentResultViewModel> {

    return this.updateEnrolment$Json$Response(params).pipe(
      map((r: StrictHttpResponse<SaveEnrolmentResultViewModel>) => r.body as SaveEnrolmentResultViewModel)
    );
  }

  /**
   * Path part for operation getPersonDetails
   */
  static readonly GetPersonDetailsPath = '/Enrolment/GetPersonDetails';

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPersonDetails$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getPersonDetails$Plain$Response(params?: {
    body?: PersonDetailsViewModel
  }): Observable<StrictHttpResponse<PersonDetailsViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetPersonDetailsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PersonDetailsViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPersonDetails$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getPersonDetails$Plain(params?: {
    body?: PersonDetailsViewModel
  }): Observable<PersonDetailsViewModel> {

    return this.getPersonDetails$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<PersonDetailsViewModel>) => r.body as PersonDetailsViewModel)
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPersonDetails$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getPersonDetails$Json$Response(params?: {
    body?: PersonDetailsViewModel
  }): Observable<StrictHttpResponse<PersonDetailsViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetPersonDetailsPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PersonDetailsViewModel>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPersonDetails$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getPersonDetails$Json(params?: {
    body?: PersonDetailsViewModel
  }): Observable<PersonDetailsViewModel> {

    return this.getPersonDetails$Json$Response(params).pipe(
      map((r: StrictHttpResponse<PersonDetailsViewModel>) => r.body as PersonDetailsViewModel)
    );
  }

  /**
   * Path part for operation deleteFaceData
   */
  static readonly DeleteFaceDataPath = '/Enrolment/DeleteFaceData';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteFaceData()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteFaceData$Response(params?: {
    faceId?: number;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.DeleteFaceDataPath, 'delete');
    if (params) {
      rb.query('faceId', params.faceId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteFaceData$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteFaceData(params?: {
    faceId?: number;
  }): Observable<void> {

    return this.deleteFaceData$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getEnrolments
   */
  static readonly GetEnrolmentsPath = '/Enrolment/GetEnrolments';

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEnrolments()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolments$Response(params?: {
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.GetEnrolmentsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEnrolments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getEnrolments(params?: {
  }): Observable<void> {

    return this.getEnrolments$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation checkIfEmployeeIdExist
   */
  static readonly CheckIfEmployeeIdExistPath = '/Enrolment/EmployeeIdExist';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `checkIfEmployeeIdExist$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfEmployeeIdExist$Plain$Response(params?: {
    employeeId?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.CheckIfEmployeeIdExistPath, 'get');
    if (params) {
      rb.query('employeeId', params.employeeId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `checkIfEmployeeIdExist$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfEmployeeIdExist$Plain(params?: {
    employeeId?: string;
  }): Observable<boolean> {

    return this.checkIfEmployeeIdExist$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `checkIfEmployeeIdExist$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfEmployeeIdExist$Json$Response(params?: {
    employeeId?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.CheckIfEmployeeIdExistPath, 'get');
    if (params) {
      rb.query('employeeId', params.employeeId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `checkIfEmployeeIdExist$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfEmployeeIdExist$Json(params?: {
    employeeId?: string;
  }): Observable<boolean> {

    return this.checkIfEmployeeIdExist$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation deleteEnrolment
   */
  static readonly DeleteEnrolmentPath = '/Enrolment/DeleteEnrolment';

  /**
   * (Auth policies: EnrolmentDelete).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteEnrolment()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteEnrolment$Response(params?: {
    id?: number;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, EnrolmentService.DeleteEnrolmentPath, 'delete');
    if (params) {
      rb.query('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * (Auth policies: EnrolmentDelete).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteEnrolment$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteEnrolment(params?: {
    id?: number;
  }): Observable<void> {

    return this.deleteEnrolment$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
