import { Component, OnInit } from '@angular/core';
import { ApplicationPermissions } from '../../api/models';
import { AppURL } from '../../app.url';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public ApplicationPermissions = ApplicationPermissions;

  constructor(
    public authenticationService: AuthenticationService,
  ) { }

  AppURL = AppURL;

  ngOnInit(): void {
  }

}
