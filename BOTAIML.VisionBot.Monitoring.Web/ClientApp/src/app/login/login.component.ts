import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AppConstants } from '../../constants/appConstants';
import { AppURL } from '../app.url';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['div.middle-box h1.logo-name { font-size: 50px; letter-spacing: 0px; }']
})
export class LoginComponent implements OnInit, OnDestroy {
  isSessionExpired: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) {
  }

  private returnUrl: string;

  form: FormGroup;

  async ngOnInit() {
    document.body.classList.add("gray-bg");
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.authenticationService
      .isLoggedIn$
      .pipe(first())
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.isSessionExpired = !this.authenticationService.isTokenValid;
          this.authenticationService.logout();
        }
      });
  }

  ngOnDestroy() {
    document.body.classList.remove("gray-bg");
  }

  async onSubmit() {
    if (this.form.invalid) {
      return this.toastrService.error('Please enter the user name and password!');
    }
    const ctrls = this.form.controls;
    try {
      await this.authenticationService.login(ctrls.username.value, ctrls.password.value);
      // redirect to returnUrl from route parameters or default to '/'
      this.router.navigate([this.returnUrl || AppURL.Default]);
    } catch (error) {
      this.toastrService.error(error.message)
    }
  }
}
