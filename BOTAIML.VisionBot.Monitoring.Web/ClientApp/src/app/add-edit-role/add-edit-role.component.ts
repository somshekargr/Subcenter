import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppConstants } from '../../constants/appConstants';
import { ReportPermissionViewModel, RoleViewModel } from '../api/models';
import { RolesService } from '../api/services';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AddEditRoleComponent implements OnInit {

  role: RoleViewModel = { id: 0, name: "", permissions: [], reportPermissions: [], users: [] };
  isNewRole: boolean = true;
  appPermissions: any = {};
  permissionGroups: string[] = [];
  reports: ReportPermissionViewModel[];

  isEditable = true;
  enrolmentForm = false;
  uniqueNameFailed = false;
  isPermissionsInvalid = false;

  constructor(
    private rolesService: RolesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {
    route.url.subscribe(urlSegment => {
      this.isNewRole = urlSegment[0].path.toLowerCase() == "add-role";
    });
  }

  ngOnInit() {
    this.rolesService
      .getApplicationPermissions$Json()
      .subscribe((permissions) => {
        this.appPermissions = permissions.applicationPermissions;

        for (let group in this.appPermissions) {
          this.permissionGroups.push(group);
        }

        this.reports = permissions.reports;
      }
      );

    if (!this.isNewRole) {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.rolesService
            .getRole$Json({ id: params['id'] })
            .subscribe((role: RoleViewModel) => {

              if (!role.permissions) role.permissions = [];
              if (!role.reportPermissions) role.reportPermissions = [];

              this.role = role;

              this.isEditable = this.role.id !== AppConstants.SUPER_USER_ROLE_ID;

              this.onNameChanged();
              this.onPermissionsChanged();
            });
        }
      });
    }
  }

  onNameChanged() {
    this.enrolmentForm = this.uniqueNameFailed = false;

    if (this.role.name.trim().length < 1) {
      this.enrolmentForm = true;
      this.uniqueNameFailed = false;
    } else {
      this.enrolmentForm = false;

      this.rolesService
        .doesRoleExist$Json({
          curRoleId: this.role.id,
          roleName: this.role.name
        })
        .subscribe((roleExists: boolean) => {
          this.uniqueNameFailed = roleExists;
          this.enrolmentForm = false;
        });
    }
  }

  onPermissionsChanged() {
    this.isPermissionsInvalid = this.role.permissions.length < 1 && this.role.reportPermissions.length < 1;
  }

  onSubmit() {
    if (!this.isEditable)
      return;

    if (this.isPermissionsInvalid)
      return;

    if (this.isNewRole) {
      this.rolesService
        .addRole$Json({ body: this.role })
        .subscribe((newRoleId: number) => {
          this.toastrService.success(AppConstants.roleCreated);
          setTimeout(() => {
            this.router.navigate(['roles']);
          }, 1000)
          error => {
            this.toastrService.error(error.error);
          }
        });
    } else {
      this.rolesService
        .editRole({ body: this.role })
        .subscribe(() => {
          this.toastrService.success(AppConstants.roleUpdated);
          error => {
            this.toastrService.error(error.error);
          }
        });
    }
  }

}
