import { Component, OnInit } from '@angular/core';
import { UserViewModel } from '../api/models/user-view-model';
import { AppURL } from '../app.url';
import { AppUtils } from '../utils/app-utils';
import { UsersService } from '../api/services';
import { LazyLoadEvent } from 'primeng/api';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ApplicationPermissions } from '../api/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  hasAddUserPermission : boolean = false;
  hasEditUserPermission: boolean = false;
  hasUserReadPermission: boolean = false;

  constructor(
    private userService: UsersService,
    private authenticationService: AuthenticationService
  ) {
  }

  AppURL = AppURL;
  loading = true;
  cols: any[];
  users: UserViewModel[];
  totalRecords: number = 0;

  getNavigationPropertyData = (data: any, column: string) =>
    AppUtils.getNavigationPropertyData(data, column)

  ngOnInit() {
    this.hasAddUserPermission = this.authenticationService.hasPermission(ApplicationPermissions.UserCreate);
    this.hasEditUserPermission = this.authenticationService.hasPermission(ApplicationPermissions.UserUpdate);
    this.hasUserReadPermission = this.authenticationService.hasPermission(ApplicationPermissions.UserRead);
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'roleName', header: 'Role Name' },
      { field: 'username', header: 'User Name' },
    ];
  }

  loadUsers(event: LazyLoadEvent) {
    this.loading = true;
    const args = AppUtils.convertToLazyLoadArgs(event);
    this.userService.getUser$Json(args).subscribe(c => {
      this.users = c.rows;
      this.totalRecords = c.totalRows;
      this.loading = false;
    });
  }
}
