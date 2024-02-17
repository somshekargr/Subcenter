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

import { PermissionsDisplayViewModel } from '../models/permissions-display-view-model';
import { PersonPermissionViewModel } from '../models/person-permission-view-model';
import { RoleViewModel } from '../models/role-view-model';
import { RoleViewModelPaginatedAndSortedResult } from '../models/role-view-model-paginated-and-sorted-result';
import { SortMeta } from '../models/sort-meta';
import { SortOrder } from '../models/sort-order';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getRoles
   */
  static readonly GetRolesPath = '/api/Roles/GetRoles';

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRoles$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRoles$Plain$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<RoleViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetRolesPath, 'get');
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
        return r as StrictHttpResponse<RoleViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRoles$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRoles$Plain(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<RoleViewModelPaginatedAndSortedResult> {

    return this.getRoles$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<RoleViewModelPaginatedAndSortedResult>) => r.body as RoleViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRoles$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRoles$Json$Response(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<StrictHttpResponse<RoleViewModelPaginatedAndSortedResult>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetRolesPath, 'get');
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
        return r as StrictHttpResponse<RoleViewModelPaginatedAndSortedResult>;
      })
    );
  }

  /**
   * (Auth policies: UserRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRoles$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRoles$Json(params?: {
    skipRows?: number;
    noOfRows?: number;
    sortField?: string;
    sortOrder?: SortOrder;
    multiSortMeta?: Array<SortMeta>;
    searchString?: string;
  }): Observable<RoleViewModelPaginatedAndSortedResult> {

    return this.getRoles$Json$Response(params).pipe(
      map((r: StrictHttpResponse<RoleViewModelPaginatedAndSortedResult>) => r.body as RoleViewModelPaginatedAndSortedResult)
    );
  }

  /**
   * Path part for operation getRole
   */
  static readonly GetRolePath = '/api/Roles/GetRole/{id}';

  /**
   * (Auth policies: RoleRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRole$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRole$Plain$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<RoleViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetRolePath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RoleViewModel>;
      })
    );
  }

  /**
   * (Auth policies: RoleRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRole$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRole$Plain(params: {
    id: number;
  }): Observable<RoleViewModel> {

    return this.getRole$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<RoleViewModel>) => r.body as RoleViewModel)
    );
  }

  /**
   * (Auth policies: RoleRead).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRole$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRole$Json$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<RoleViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetRolePath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RoleViewModel>;
      })
    );
  }

  /**
   * (Auth policies: RoleRead).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getRole$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRole$Json(params: {
    id: number;
  }): Observable<RoleViewModel> {

    return this.getRole$Json$Response(params).pipe(
      map((r: StrictHttpResponse<RoleViewModel>) => r.body as RoleViewModel)
    );
  }

  /**
   * Path part for operation getApplicationPermissions
   */
  static readonly GetApplicationPermissionsPath = '/api/Roles/GetApplicationPermissions';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApplicationPermissions$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApplicationPermissions$Plain$Response(params?: {
  }): Observable<StrictHttpResponse<PermissionsDisplayViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetApplicationPermissionsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PermissionsDisplayViewModel>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApplicationPermissions$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApplicationPermissions$Plain(params?: {
  }): Observable<PermissionsDisplayViewModel> {

    return this.getApplicationPermissions$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<PermissionsDisplayViewModel>) => r.body as PermissionsDisplayViewModel)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getApplicationPermissions$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApplicationPermissions$Json$Response(params?: {
  }): Observable<StrictHttpResponse<PermissionsDisplayViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetApplicationPermissionsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PermissionsDisplayViewModel>;
      })
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getApplicationPermissions$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getApplicationPermissions$Json(params?: {
  }): Observable<PermissionsDisplayViewModel> {

    return this.getApplicationPermissions$Json$Response(params).pipe(
      map((r: StrictHttpResponse<PermissionsDisplayViewModel>) => r.body as PermissionsDisplayViewModel)
    );
  }

  /**
   * Path part for operation doesRoleExist
   */
  static readonly DoesRoleExistPath = '/api/Roles/DoesRoleExist';

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `doesRoleExist$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  doesRoleExist$Plain$Response(params?: {
    curRoleId?: number;
    roleName?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.DoesRoleExistPath, 'get');
    if (params) {
      rb.query('curRoleId', params.curRoleId, {});
      rb.query('roleName', params.roleName, {});
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
   * To access the full response (for headers, for example), `doesRoleExist$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  doesRoleExist$Plain(params?: {
    curRoleId?: number;
    roleName?: string;
  }): Observable<boolean> {

    return this.doesRoleExist$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * (Auth).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `doesRoleExist$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  doesRoleExist$Json$Response(params?: {
    curRoleId?: number;
    roleName?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.DoesRoleExistPath, 'get');
    if (params) {
      rb.query('curRoleId', params.curRoleId, {});
      rb.query('roleName', params.roleName, {});
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
   * To access the full response (for headers, for example), `doesRoleExist$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  doesRoleExist$Json(params?: {
    curRoleId?: number;
    roleName?: string;
  }): Observable<boolean> {

    return this.doesRoleExist$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation addRole
   */
  static readonly AddRolePath = '/api/Roles/AddRole';

  /**
   * (Auth policies: RoleCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addRole$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addRole$Plain$Response(params?: {
    body?: RoleViewModel
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.AddRolePath, 'post');
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
   * (Auth policies: RoleCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addRole$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addRole$Plain(params?: {
    body?: RoleViewModel
  }): Observable<number> {

    return this.addRole$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * (Auth policies: RoleCreate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addRole$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addRole$Json$Response(params?: {
    body?: RoleViewModel
  }): Observable<StrictHttpResponse<number>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.AddRolePath, 'post');
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
   * (Auth policies: RoleCreate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addRole$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addRole$Json(params?: {
    body?: RoleViewModel
  }): Observable<number> {

    return this.addRole$Json$Response(params).pipe(
      map((r: StrictHttpResponse<number>) => r.body as number)
    );
  }

  /**
   * Path part for operation editRole
   */
  static readonly EditRolePath = '/api/Roles/EditRole';

  /**
   * (Auth policies: RoleUpdate).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `editRole()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  editRole$Response(params?: {
    body?: RoleViewModel
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.EditRolePath, 'post');
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
   * (Auth policies: RoleUpdate).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `editRole$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  editRole(params?: {
    body?: RoleViewModel
  }): Observable<void> {

    return this.editRole$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation hasPermission
   */
  static readonly HasPermissionPath = '/api/Roles/HasPermission';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `hasPermission$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  hasPermission$Plain$Response(params: {
    faceIndexId: string;
    permission?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.HasPermissionPath, 'get');
    if (params) {
      rb.path('faceIndexId', params.faceIndexId, {});
      rb.query('permission', params.permission, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `hasPermission$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  hasPermission$Plain(params: {
    faceIndexId: string;
    permission?: string;
  }): Observable<boolean> {

    return this.hasPermission$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `hasPermission$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  hasPermission$Json$Response(params: {
    faceIndexId: string;
    permission?: string;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.HasPermissionPath, 'get');
    if (params) {
      rb.path('faceIndexId', params.faceIndexId, {});
      rb.query('permission', params.permission, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `hasPermission$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  hasPermission$Json(params: {
    faceIndexId: string;
    permission?: string;
  }): Observable<boolean> {

    return this.hasPermission$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation getAllPemissions
   */
  static readonly GetAllPemissionsPath = '/api/Roles/GetAllPemissions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllPemissions$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPemissions$Plain$Response(params?: {
    faceIndexId?: string;
  }): Observable<StrictHttpResponse<Array<string>>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetAllPemissionsPath, 'get');
    if (params) {
      rb.query('faceIndexId', params.faceIndexId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<string>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllPemissions$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPemissions$Plain(params?: {
    faceIndexId?: string;
  }): Observable<Array<string>> {

    return this.getAllPemissions$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<string>>) => r.body as Array<string>)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllPemissions$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPemissions$Json$Response(params?: {
    faceIndexId?: string;
  }): Observable<StrictHttpResponse<Array<string>>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetAllPemissionsPath, 'get');
    if (params) {
      rb.query('faceIndexId', params.faceIndexId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<string>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAllPemissions$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPemissions$Json(params?: {
    faceIndexId?: string;
  }): Observable<Array<string>> {

    return this.getAllPemissions$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<string>>) => r.body as Array<string>)
    );
  }

  /**
   * Path part for operation getPersonPermissionViewModel
   */
  static readonly GetPersonPermissionViewModelPath = '/api/Roles/GetPersonPermissionViewModel';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPersonPermissionViewModel$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPersonPermissionViewModel$Plain$Response(params?: {
    faceIndexId?: string;
    permission?: string;
  }): Observable<StrictHttpResponse<PersonPermissionViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetPersonPermissionViewModelPath, 'get');
    if (params) {
      rb.query('faceIndexId', params.faceIndexId, {});
      rb.query('permission', params.permission, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PersonPermissionViewModel>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPersonPermissionViewModel$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPersonPermissionViewModel$Plain(params?: {
    faceIndexId?: string;
    permission?: string;
  }): Observable<PersonPermissionViewModel> {

    return this.getPersonPermissionViewModel$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<PersonPermissionViewModel>) => r.body as PersonPermissionViewModel)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPersonPermissionViewModel$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPersonPermissionViewModel$Json$Response(params?: {
    faceIndexId?: string;
    permission?: string;
  }): Observable<StrictHttpResponse<PersonPermissionViewModel>> {

    const rb = new RequestBuilder(this.rootUrl, RolesService.GetPersonPermissionViewModelPath, 'get');
    if (params) {
      rb.query('faceIndexId', params.faceIndexId, {});
      rb.query('permission', params.permission, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PersonPermissionViewModel>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPersonPermissionViewModel$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPersonPermissionViewModel$Json(params?: {
    faceIndexId?: string;
    permission?: string;
  }): Observable<PersonPermissionViewModel> {

    return this.getPersonPermissionViewModel$Json$Response(params).pipe(
      map((r: StrictHttpResponse<PersonPermissionViewModel>) => r.body as PersonPermissionViewModel)
    );
  }

}
