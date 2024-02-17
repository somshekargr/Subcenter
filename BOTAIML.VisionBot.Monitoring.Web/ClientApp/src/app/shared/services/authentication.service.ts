import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { UsersService } from '../../api/services';
import { AuthenticatedUser } from '../authenticatedUser';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private userSubject: ReplaySubject<AuthenticatedUser>;
  public user$: Observable<AuthenticatedUser>;

  private isLoggedInSubject: ReplaySubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  private _isLoggedIn: boolean = false;

  private _user: AuthenticatedUser;
  private tokenString: string;

  constructor(
    private userService: UsersService
  ) {
    this.userSubject = new ReplaySubject<AuthenticatedUser>();
    this.user$ = this.userSubject.asObservable();

    this.isLoggedInSubject = new ReplaySubject<boolean>();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    this.ensureTokenDecoded();

    this.notifyUserChange();
  }

  private ensureTokenDecoded() {
    if (this._user) return;

    this.tokenString = localStorage.getItem('currentUser');

    if (this.tokenString) {
      const token = jwt_decode(this.tokenString);
      this._user = new AuthenticatedUser(token);
    } else {
      this.logout();
    }
  }

  private notifyUserChange() {
    if (this.isTokenValid) {
      this._isLoggedIn = true;
      this.userSubject.next(this._user);
      this.isLoggedInSubject.next(true);
    } else {
      this._isLoggedIn = false;
      this.userSubject.next(null);
      this.isLoggedInSubject.next(false);
    }
  }

  public get authToken(): string {
    return this.tokenString;
  }

  public get authenticatedUser(): AuthenticatedUser {
    return this._user;
  }

  public get isTokenValid(): boolean {
    if (!this.tokenString)
      return false;

    if (this._user !== null) {
      return this._user.isTokenValid();
    }

    //If we have an expired token, force logout
    if (this.tokenString)
      this.logout();

    return false;
  }

  public hasPermission(permission: string): boolean {
    if (!permission)
      return true;

    if (!this._isLoggedIn)
      return false;

    if (!this._user.permissions)
      return false;

    return this._user.permissions.findIndex((v) => v.toLowerCase() == permission.toLowerCase()) >= 0;
  }

  public hasAnyPermission(permissions: string[]): boolean {
    for (var i = 0; i < permissions.length; i++) {
      if (this.hasPermission(permissions[i]))
        return true;
    }

    return false;
  }

  public hasAllPermissions(permissions: string[]): boolean {
    for (var i = 0; i < permissions.length; i++) {
      if (!this.hasPermission(permissions[i]))
        return false;
    }

    return true;
  }

  async login(username: string, password: string) {
    this.tokenString = null;
    this._user = null;

    const token = await this.userService.authenticate$Json({
      body: { username, password }
    }).toPromise();

    if (!token) return;

    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentUser', token);

    this.ensureTokenDecoded();

    this.notifyUserChange();
  }

  logout() {
    // Clear out in-memory data
    this._user = null;
    this.tokenString = null;

    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');

    this.notifyUserChange();
  }
}
