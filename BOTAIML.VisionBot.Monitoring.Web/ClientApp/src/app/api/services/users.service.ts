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

import { AddEditUserViewModel } from '../models/add-edit-user-view-model';
import { ChangePasswordViewModel } from '../models/change-password-view-model';
import { LoginViewModel } from '../models/login-view-model';
import { NewUserViewModel } from '../models/new-user-view-model';
import { ResetPasswordViewModel } from '../models/reset-password-view-model';
import { SaveUserResultViewModel } from '../models/save-user-result-view-model';
import { SortMeta } from '../models/sort-meta';
import { SortOrder } from '../models/sort-order';
import { UserViewModel } from '../models/user-view-model';
import { UserViewModelPaginatedAndSortedResult } from '../models/user-view-model-paginated-and-sorted-result';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getUser
   */
  static readonly GetUserPath = '/api/Users/GetUser';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUser$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser$Plain$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<UserViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserPath, 'get');
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
        return r as StrictHttpResponse<UserViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUser$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser$Plain(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<UserViewModelPaginatedAndSortedResult> {

    return this.getUser$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<UserViewModelPaginatedAndSortedResult>) => r.body as UserViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUser$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser$Json$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<UserViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserPath, 'get');
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
        return r as StrictHttpResponse<UserViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUser$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUser$Json(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<UserViewModelPaginatedAndSortedResult> {

    return this.getUser$Json$Response(params).pipe(
      map((r: StrictHttpResponse<UserViewModelPaginatedAndSortedResult>) => r.body as UserViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * Path part for operation authenticate
   */
  static readonly AuthenticatePath = '/api/Users/authenticate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  authenticate$Plain$Response(params?: {
    body?: LoginViewModel
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.AuthenticatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `authenticate$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  authenticate$Plain(params?: {
    body?: LoginViewModel
  }): Observable<string> {

    return this.authenticate$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  authenticate$Json$Response(params?: {
    body?: LoginViewModel
  }): Observable<StrictHttpResponse<string>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.AuthenticatePath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `authenticate$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  authenticate$Json(params?: {
    body?: LoginViewModel
  }): Observable<string> {

    return this.authenticate$Json$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation checkIfUserNameExist
   */
  static readonly CheckIfUserNameExistPath = '/api/Users/UserNameExist';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `checkIfUserNameExist$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfUserNameExist$Plain$Response(params?: {
    userName?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.CheckIfUserNameExistPath, 'get');
    if (params) {
      rb.query('userName', params.userName, {});
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
   * To access the full response (for headers, for example), `checkIfUserNameExist$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfUserNameExist$Plain(params?: {
    userName?: string;
  }): Observable<boolean> {

    return this.checkIfUserNameExist$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `checkIfUserNameExist$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfUserNameExist$Json$Response(params?: {
    userName?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.CheckIfUserNameExistPath, 'get');
    if (params) {
      rb.query('userName', params.userName, {});
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
   * To access the full response (for headers, for example), `checkIfUserNameExist$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  checkIfUserNameExist$Json(params?: {
    userName?: string;
  }): Observable<boolean> {

    return this.checkIfUserNameExist$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation newUser
   */
  static readonly NewUserPath = '/api/Users/NewUser';

  /**
   * (Auth policies: UserCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `newUser$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newUser$Plain$Response(params?: {
    body?: NewUserViewModel
  }): Observable<StrictHttpResponse<SaveUserResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.NewUserPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveUserResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `newUser$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newUser$Plain(params?: {
    body?: NewUserViewModel
  }): Observable<SaveUserResultViewModel> {

    return this.newUser$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<SaveUserResultViewModel>) => r.body as SaveUserResultViewModel)
    );
  }

  /**
   * (Auth policies: UserCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `newUser$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newUser$Json$Response(params?: {
    body?: NewUserViewModel
  }): Observable<StrictHttpResponse<SaveUserResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.NewUserPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveUserResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `newUser$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  newUser$Json(params?: {
    body?: NewUserViewModel
  }): Observable<SaveUserResultViewModel> {

    return this.newUser$Json$Response(params).pipe(
      map((r: StrictHttpResponse<SaveUserResultViewModel>) => r.body as SaveUserResultViewModel)
    );
  }

  /**
   * Path part for operation updateUser
   */
  static readonly UpdateUserPath = '/api/Users/UpdateUser';

  /**
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateUser$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateUser$Plain$Response(params?: {
    body?: UserViewModel
  }): Observable<StrictHttpResponse<SaveUserResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.UpdateUserPath, 'put');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveUserResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateUser$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateUser$Plain(params?: {
    body?: UserViewModel
  }): Observable<SaveUserResultViewModel> {

    return this.updateUser$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<SaveUserResultViewModel>) => r.body as SaveUserResultViewModel)
    );
  }

  /**
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateUser$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateUser$Json$Response(params?: {
    body?: UserViewModel
  }): Observable<StrictHttpResponse<SaveUserResultViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.UpdateUserPath, 'put');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<SaveUserResultViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateUser$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateUser$Json(params?: {
    body?: UserViewModel
  }): Observable<SaveUserResultViewModel> {

    return this.updateUser$Json$Response(params).pipe(
      map((r: StrictHttpResponse<SaveUserResultViewModel>) => r.body as SaveUserResultViewModel)
    );
  }

  /**
   * Path part for operation changePassword
   */
  static readonly ChangePasswordPath = '/api/Users/ChangePassword';

  /**
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changePassword()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  changePassword$Response(params?: {
    body?: ChangePasswordViewModel
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.ChangePasswordPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
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
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `changePassword$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  changePassword(params?: {
    body?: ChangePasswordViewModel
  }): Observable<void> {

    return this.changePassword$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation resetPassword
   */
  static readonly ResetPasswordPath = '/api/Users/ResetPassword';

  /**
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `resetPassword()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  resetPassword$Response(params?: {
    body?: ResetPasswordViewModel
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.ResetPasswordPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
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
   * (Auth policies: UserUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `resetPassword$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  resetPassword(params?: {
    body?: ResetPasswordViewModel
  }): Observable<void> {

    return this.resetPassword$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getRoles_1
   */
  static readonly GetRoles_1Path = '/api/Users/GetRoles';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRoles_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRoles_1$Response(params?: {
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetRoles_1Path, 'get');
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
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRoles_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRoles_1(params?: {
  }): Observable<void> {

    return this.getRoles_1$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUserDetails
   */
  static readonly GetUserDetailsPath = '/api/Users/{id}';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserDetails$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetails$Plain$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<AddEditUserViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserDetailsPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AddEditUserViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserDetails$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetails$Plain(params: {
    id: number;
  }): Observable<AddEditUserViewModel> {

    return this.getUserDetails$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<AddEditUserViewModel>) => r.body as AddEditUserViewModel)
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserDetails$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetails$Json$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<AddEditUserViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserDetailsPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AddEditUserViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserDetails$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetails$Json(params: {
    id: number;
  }): Observable<AddEditUserViewModel> {

    return this.getUserDetails$Json$Response(params).pipe(
      map((r: StrictHttpResponse<AddEditUserViewModel>) => r.body as AddEditUserViewModel)
    );
  }

  /**
   * Path part for operation getUserDetailsByUsername
   */
  static readonly GetUserDetailsByUsernamePath = '/api/Users/GetUserDetailsByUsername';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserDetailsByUsername$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetailsByUsername$Plain$Response(params?: {
    username?: string;
  }): Observable<StrictHttpResponse<UserViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserDetailsByUsernamePath, 'get');
    if (params) {
      rb.query('username', params.username, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserDetailsByUsername$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetailsByUsername$Plain(params?: {
    username?: string;
  }): Observable<UserViewModel> {

    return this.getUserDetailsByUsername$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<UserViewModel>) => r.body as UserViewModel)
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserDetailsByUsername$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetailsByUsername$Json$Response(params?: {
    username?: string;
  }): Observable<StrictHttpResponse<UserViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUserDetailsByUsernamePath, 'get');
    if (params) {
      rb.query('username', params.username, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserViewModel>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUserDetailsByUsername$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserDetailsByUsername$Json(params?: {
    username?: string;
  }): Observable<UserViewModel> {

    return this.getUserDetailsByUsername$Json$Response(params).pipe(
      map((r: StrictHttpResponse<UserViewModel>) => r.body as UserViewModel)
    );
  }

  /**
   * Path part for operation getUsersByRoleId
   */
  static readonly GetUsersByRoleIdPath = '/api/Users/GetUsersByRoleId';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsersByRoleId()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsersByRoleId$Response(params?: {
    roleId?: number;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUsersByRoleIdPath, 'get');
    if (params) {
      rb.query('roleId', params.roleId, {});
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
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUsersByRoleId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsersByRoleId(params?: {
    roleId?: number;
  }): Observable<void> {

    return this.getUsersByRoleId$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation getUsers
   */
  static readonly GetUsersPath = '/api/Users/GetUsers';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers$Response(params?: {
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.GetUsersPath, 'get');
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
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers(params?: {
  }): Observable<void> {

    return this.getUsers$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation isSuperUserOrNot
   */
  static readonly IsSuperUserOrNotPath = '/api/Users/IsSuperUserOrNot';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `isSuperUserOrNot$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  isSuperUserOrNot$Plain$Response(params?: {
    loggedInUserId?: number;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.IsSuperUserOrNotPath, 'get');
    if (params) {
      rb.query('loggedInUserId', params.loggedInUserId, {});
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
   * To access the full response (for headers, for example), `isSuperUserOrNot$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  isSuperUserOrNot$Plain(params?: {
    loggedInUserId?: number;
  }): Observable<boolean> {

    return this.isSuperUserOrNot$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `isSuperUserOrNot$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  isSuperUserOrNot$Json$Response(params?: {
    loggedInUserId?: number;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, UsersService.IsSuperUserOrNotPath, 'get');
    if (params) {
      rb.query('loggedInUserId', params.loggedInUserId, {});
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
   * To access the full response (for headers, for example), `isSuperUserOrNot$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  isSuperUserOrNot$Json(params?: {
    loggedInUserId?: number;
  }): Observable<boolean> {

    return this.isSuperUserOrNot$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

}
