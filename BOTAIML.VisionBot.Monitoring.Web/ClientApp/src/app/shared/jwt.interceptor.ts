import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent, HttpErrorResponse
} from "@angular/common/http";
import { AuthenticationService } from '../shared/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs/internal/observable/throwError";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // add auth header with jwt if user is logged in and request is to api url

    if (this.authenticationService.isTokenValid) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.authToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        return throwError(error.error);
      })
    );
  }
}
