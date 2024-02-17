import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { RoleViewModel } from '../api/models';
import { ApplicationPermissions } from '../api/models/application-permissions';
import { RolesService } from '../api/services';
import { AppURL } from '../app.url';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AppUtils } from '../utils/app-utils';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
  providers: [MessageService]
})
export class RolesComponent implements OnInit {
  roles: RoleViewModel[];
  AppURL = AppURL;
  loading = true;
  cols: any[];
  totalRecords: number = 0;

  hasAddRolePermission: boolean = false;
  hasEditRolePermission: boolean = false;
  hasRoleReadPermission: boolean = false;

  constructor(
    private rolesService: RolesService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.hasRoleReadPermission = this.authenticationService.hasPermission(ApplicationPermissions.RoleRead);
    this.hasAddRolePermission = this.authenticationService.hasPermission(ApplicationPermissions.RoleCreate);
    this.hasEditRolePermission = this.authenticationService.hasPermission(ApplicationPermissions.RoleUpdate);
  }

  loadRoles(event: LazyLoadEvent) {
    this.loading = true;
    const args = AppUtils.convertToLazyLoadArgs(event);
    this.rolesService.getRoles$Json(args).subscribe(c => {
      this.roles = c.rows;
      this.totalRecords = c.totalRows;
      this.loading = false;
    });
  }
}
