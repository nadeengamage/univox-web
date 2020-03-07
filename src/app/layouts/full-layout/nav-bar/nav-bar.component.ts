import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  signInUser;
  isSignIn;
  hideSignOut = false;

  constructor(
    private authService: AuthService,
    ) { }

  ngOnInit() {
    this.isSignIn = this.authService.getToken();
    this.signInUser = this.authService.currentUser;
    if (this.isSignIn !== null) {
      this.hideSignOut = true;
    } else {
      this.hideSignOut = false;
    }
  }

  logOut() {
    this.authService.doLogout();
  }

}
