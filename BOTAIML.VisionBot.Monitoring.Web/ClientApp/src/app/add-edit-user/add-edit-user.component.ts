import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConstants } from '../../constants/appConstants';
import { DropDownListItem, SaveUserResultViewModel } from '../api/models';
import { UserViewModel } from '../api/models/user-view-model';
import { UsersService } from '../api/services';
import { AuthenticatedUser } from '../shared/authenticatedUser';
import { AuthenticationService } from '../shared/services/authentication.service';
import { mustMatch } from '../utils/must-match-validator';
import { noWhitespaceValidator } from '../utils/no-Whitespace-Validator';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html'
})
export class AddEditUserComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUserSubscription: Subscription;
  currentUser: AuthenticatedUser;
  roles: DropDownListItem[];
  user: UserViewModel;
  userFormGroup: FormGroup;
  changePassword: boolean;
  viewResetPassword: boolean;
  isSaveCompleted = false;
  saveResult: SaveUserResultViewModel;
  isSuperUser: boolean = false;;

  constructor(
    private userService: UsersService,
    private builder: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  id: number;
  isloaded = false;
  isFormPageInitialized: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = Number.parseInt(params.id || 0);
      this.changePassword = this.id < 1;
      this.loadUserDetails();
    });

    this.currentUserSubscription = this.authenticationService.user$.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
  }

  ngAfterViewInit() {
    if (this.currentUser != null) {
      this.currentUser = this.currentUser;
      this.checkSuperUser();
    }
  }

  checkSuperUser() {
    this.userService.isSuperUserOrNot$Json({ loggedInUserId: this.currentUser.id }).subscribe(result => {
      this.isSuperUser = result;
    });
  }

  get f() {
    return this.userFormGroup.controls;
  }

  get showOldPassword() {
    return this.id > 0 && this.changePassword;
  }

  get showPassword() {
    return this.id < 1 || this.changePassword;
  }

  get showResetPassword() {
    return this.viewResetPassword;
  }

  loadUserDetails() {
    this.userService.getUserDetails$Json({ id: this.id }).subscribe(result => {
      this.roles = result.roles;
      this.user = result.user;
      this.initializeForm();
      this.isloaded = true;
    });
  }

  initializeForm() {
    this.userFormGroup = this.builder.group({
      name: new FormControl(this.user.name, [Validators.required, Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")]),
      username: new FormControl(this.user.username, [Validators.required, Validators.pattern("^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$")]),
      role: new FormControl((this.user.id > 0) ? (this.user.roleId.toString()) : null, [Validators.required]),
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(8), noWhitespaceValidator]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), noWhitespaceValidator])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), noWhitespaceValidator])),

    }, {
      validators: [mustMatch('password', 'confirmPassword')]
    });

    if (this.id < 1) {
      this.showChangePasswordControls();
    } else {
      this.cancelChangePassword();
    }
    this.isFormPageInitialized = true;
  }

  async checkIfUserNameExists(userName: string) {
    const request = new Promise<boolean>((resolve, reject) => {
      this.userService.checkIfUserNameExist$Json({
        userName: userName
      }).subscribe((result) => {
        resolve(result);
      },
        (error) => {
          reject(error);
        });
    });
    return request;
  }

  async saveUser() {
    if (this.userFormGroup.invalid) {
      this.userFormGroup.markAllAsTouched();
      return;
    }

    let user = {
      id: this.id,
      name: this.f.name.value,
      username: this.f.username.value,
      roleId: Number(this.f.role.value),
    } as UserViewModel;

    if (this.id > 0) {
      this.userService.updateUser$Json({ body: user })
        .subscribe(
          result => {
            this.saveResult = result;

            this.isSaveCompleted = true;
            this.toastrService.success(AppConstants.userUpdated);
          },
          error => {
            this.toastrService.error(error.error);
          });
    } else {
      user = Object.assign({
        passwordInfo: {
          password: this.f.password.value,
          confirmPassword: this.f.confirmPassword.value
        }
      }, user);
      let isUserNameExist = await this.checkIfUserNameExists(user.username);

      if (isUserNameExist) {
        this.toastrService.warning('The User Name already exists, Please add new User Name!');
      }
      else {
        this.userService.newUser$Json({ body: user })
          .subscribe(
            result => {
              this.saveResult = result;
              this.isSaveCompleted = true;
              this.toastrService.success(AppConstants.userCreated);
            },
            error => {
              this.toastrService.error(error.error);
            });
      }
    }
  }

  showChangePasswordControls() {
    this.cancelResetPassword();
    this.changePassword = true;

    if (this.id > 0) {
      this.f.oldPassword.enable();
    } else {
      this.f.oldPassword.disable();
    }

    this.f.password.enable();
    this.f.confirmPassword.enable();
  }

  showResetPasswordControls() {
    this.changePassword = false;

    this.viewResetPassword = true;
    this.f.oldPassword.disable();

    this.f.password.enable();
    this.f.confirmPassword.enable();
  }

  cancelResetPassword() {
    this.viewResetPassword = false;

    if (this.id > 0) {
      this.f.password.setValue('');
      this.f.password.disable();

      this.f.confirmPassword.setValue('');
      this.f.confirmPassword.disable();
    }

  }

  cancelChangePassword() {
    this.changePassword = false;
    this.f.oldPassword.setValue('');

    this.f.oldPassword.disable();
    if (this.id > 0) {
      this.f.password.setValue('');
      this.f.password.disable();

      this.f.confirmPassword.setValue('');
      this.f.confirmPassword.disable();
    }
  }

  reload() {
    if (this.id > 0) {
      this.loadUserDetails();
      this.saveResult = null;
      this.isSaveCompleted = false;
    } else {
      this.router.navigateByUrl(`/user-edit/${this.saveResult.userId}`);
    }
  }

  confirmChangePassword() {
    const changePasswordVM = {
      userId: this.id,
      oldPassword: this.f.oldPassword.value,
      password: this.f.password.value,
      confirmPassword: this.f.confirmPassword.value
    };

    this.userService.changePassword({ body: changePasswordVM })
      .subscribe(
        () => {
          // Reset and hide the Change Password controls
          this.cancelChangePassword();

          // Now show the success message
          this.toastrService.success('Password changed sucessfully!');
        },
        error => {
          this.toastrService.error(error);
        }
      );
  }

  resetPassword() {
    const resetPasswordVM = {
      userId: this.id,
      password: this.f.password.value,
      confirmPassword: this.f.confirmPassword.value
    };

    this.userService.resetPassword({ body: resetPasswordVM })
      .subscribe(
        () => {
          // Reset and hide the Change Password controls
          this.cancelResetPassword();

          // Now show the success message
          this.toastrService.success('Password updated sucessfully!');
        },
        error => {
        }
      );
  }
}


