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
    const user = JSON.parse(
      window.atob(
        localStorage.getItem('user_details')
        ? localStorage.getItem('user_details')
        : 'e30='
      )
    );
    this.signInUser = user.username;
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
