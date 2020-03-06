import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public signInUser = sessionStorage.getItem('username');

  constructor(
    private authService: AuthService,
    ) { }

  ngOnInit() {
  }

  logOut() {
    this.authService.doLogout();
  }

}
