import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../services/authentication.service';
import { AuthenticatedUser } from '../authenticatedUser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: AuthenticatedUser;
  isLoggedIn: boolean;
  isLoggedInSubscription: Subscription;
  currentUserSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {

    this.currentUserSubscription = this.authenticationService.user$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }
}
