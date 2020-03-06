import { Injectable } from '@angular/core';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UnivoxService {

  private mainUrl = 'http://152.67.9.121:5000';
  private getUsers: string;

  constructor(private http: HttpUtilsService) {
    this.getUsers = this.mainUrl + '/api/v1/users';
  }

  public getAllUsers() {
    const users = this.getUsers;
    return this.http.get(users);
  }

}
