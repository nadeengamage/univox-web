import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../service/authentication.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidLogin = false;
  signinForm: FormGroup;
  isActive = true;

  public loading = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notifier: NotifierService
  ) {
    this.signinForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit() {
  }

  loginUser() {
    // this.loading = true;
    this.authService.signIn(this.signinForm.value);
    // this.loading = this.authService.hideLoading();
  }

}
