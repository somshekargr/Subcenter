import { Subscription } from 'rxjs';
import { Injectable, OnDestroy } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AppURL } from '../app.url';
import { AuthenticationService } from '../shared/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {
  isLoggedIn: boolean;
  subscription: Subscription;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.subscription = this.authenticationService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.isLoggedIn) {
      // not logged in
      this.router.navigate([AppURL.Login], {
        queryParams: { returnUrl: state.url }
      });

      return false;
    }

    // check if route is restricted by role
    if (route.data.permissions) {
      let isValid = false;

      if (route.data.any === true) {
        isValid = this.authenticationService.hasAnyPermission(route.data.permissions);
      } else {
        isValid = this.authenticationService.hasAllPermissions(
          route.data.permissions
        );
      }

      if (!isValid) {
        // role not authorised so redirect to home page
        this.router.navigate([AppURL.Default]);

        return false;
      }
    }

    //authorised so return true
    return true;
  }
}
