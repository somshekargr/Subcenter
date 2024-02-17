import { AppURL } from './../../app.url';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatedUser } from '../authenticatedUser';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent implements OnInit, OnDestroy {
  currentUser: AuthenticatedUser;
  isLoggedIn: boolean;
  isLoggedInSubscription: Subscription;
  currentUserSubscription: Subscription;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.isLoggedInSubscription = this.authenticationService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.currentUserSubscription = this.authenticationService.user$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  logout() {
    this.authenticationService.logout();
    //location.reload(true); //we need to write removing the token from the server, otherwise it shows the same access to new user after the current logs out.
    this.router.navigate([AppURL.Login]);
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
    this.currentUserSubscription.unsubscribe();
  }

  toggleCollapse() {
    $("body").toggleClass("mini-navbar");
    this.smoothlyMenu();
  }

  smoothlyMenu() {
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(
        function () {
          $('#side-menu').fadeIn(400);
        }, 200);
    } else if ($('body').hasClass('fixed-sidebar')) {
      $('#side-menu').hide();
      setTimeout(
        function () {
          $('#side-menu').fadeIn(400);
        }, 100);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  }
}
