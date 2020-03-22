import { Injectable } from '@angular/core';

@Injectable()
export class UserDetailsService {
  constructor() {}


  getRequestInfo() {
    const user = JSON.parse(
        window.atob(
          localStorage.getItem('user_details')
          ? localStorage.getItem('user_details')
          : 'e30='
        )
      );
    return user.roles.role_code;
  }
}
