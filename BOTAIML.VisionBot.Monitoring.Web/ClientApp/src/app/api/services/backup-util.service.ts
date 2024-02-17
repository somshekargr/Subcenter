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

import { BackupResult } from '../models/backup-result';
import { FileDeleteResult } from '../models/file-delete-result';

@Injectable({
  providedIn: 'root',
})
export class BackupUtilService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation dailyBackupDatabase
   */
  static readonly DailyBackupDatabasePath = '/BackupUtil/DailyBackupDatabase';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `dailyBackupDatabase$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  dailyBackupDatabase$Plain$Response(params?: {
  }): Observable<StrictHttpResponse<BackupResult>> {

    const rb = new RequestBuilder(this.rootUrl, BackupUtilService.DailyBackupDatabasePath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BackupResult>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `dailyBackupDatabase$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  dailyBackupDatabase$Plain(params?: {
  }): Observable<BackupResult> {

    return this.dailyBackupDatabase$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<BackupResult>) => r.body as BackupResult)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `dailyBackupDatabase$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  dailyBackupDatabase$Json$Response(params?: {
  }): Observable<StrictHttpResponse<BackupResult>> {

    const rb = new RequestBuilder(this.rootUrl, BackupUtilService.DailyBackupDatabasePath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<BackupResult>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `dailyBackupDatabase$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  dailyBackupDatabase$Json(params?: {
  }): Observable<BackupResult> {

    return this.dailyBackupDatabase$Json$Response(params).pipe(
      map((r: StrictHttpResponse<BackupResult>) => r.body as BackupResult)
    );
  }

  /**
   * Path part for operation deleteBackupsOlderthanDays
   */
  static readonly DeleteBackupsOlderthanDaysPath = '/BackupUtil/DeleteBackupsOlderthanDays';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteBackupsOlderthanDays$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteBackupsOlderthanDays$Plain$Response(params?: {
  }): Observable<StrictHttpResponse<FileDeleteResult>> {

    const rb = new RequestBuilder(this.rootUrl, BackupUtilService.DeleteBackupsOlderthanDaysPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FileDeleteResult>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteBackupsOlderthanDays$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteBackupsOlderthanDays$Plain(params?: {
  }): Observable<FileDeleteResult> {

    return this.deleteBackupsOlderthanDays$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<FileDeleteResult>) => r.body as FileDeleteResult)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteBackupsOlderthanDays$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteBackupsOlderthanDays$Json$Response(params?: {
  }): Observable<StrictHttpResponse<FileDeleteResult>> {

    const rb = new RequestBuilder(this.rootUrl, BackupUtilService.DeleteBackupsOlderthanDaysPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<FileDeleteResult>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deleteBackupsOlderthanDays$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteBackupsOlderthanDays$Json(params?: {
  }): Observable<FileDeleteResult> {

    return this.deleteBackupsOlderthanDays$Json$Response(params).pipe(
      map((r: StrictHttpResponse<FileDeleteResult>) => r.body as FileDeleteResult)
    );
  }

}
