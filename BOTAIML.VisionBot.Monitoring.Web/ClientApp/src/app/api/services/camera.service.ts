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

import { LiveStreamViewModel } from '../models/live-stream-view-model';

@Injectable({
  providedIn: 'root',
})
export class CameraService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getCameraWiseStatus
   */
  static readonly GetCameraWiseStatusPath = '/api/Camera/GetCameraWiseStatus';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCameraWiseStatus$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCameraWiseStatus$Plain$Response(params?: {
  }): Observable<StrictHttpResponse<Array<LiveStreamViewModel>>> {

    const rb = new RequestBuilder(this.rootUrl, CameraService.GetCameraWiseStatusPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LiveStreamViewModel>>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCameraWiseStatus$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCameraWiseStatus$Plain(params?: {
  }): Observable<Array<LiveStreamViewModel>> {

    return this.getCameraWiseStatus$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<LiveStreamViewModel>>) => r.body as Array<LiveStreamViewModel>)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCameraWiseStatus$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCameraWiseStatus$Json$Response(params?: {
  }): Observable<StrictHttpResponse<Array<LiveStreamViewModel>>> {

    const rb = new RequestBuilder(this.rootUrl, CameraService.GetCameraWiseStatusPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<LiveStreamViewModel>>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCameraWiseStatus$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCameraWiseStatus$Json(params?: {
  }): Observable<Array<LiveStreamViewModel>> {

    return this.getCameraWiseStatus$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<LiveStreamViewModel>>) => r.body as Array<LiveStreamViewModel>)
    );
  }

}
