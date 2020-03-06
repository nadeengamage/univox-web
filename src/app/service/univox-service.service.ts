import { Injectable } from '@angular/core';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UnivoxService {

  private mainUrl = '/api/v1';
  private getUsers: string;
  private getFaculty: string;

  constructor(private http: HttpUtilsService) {
    this.getUsers = this.mainUrl + '/users';
    this.getFaculty = this.mainUrl + '/faculties';
  }

  public getAllUsers() {
    const users = this.getUsers;
    return this.http.get(users);
  }

  public getAllFaculties() {
    const faculties = this.getFaculty;
    return this.http.get(faculties);
  }

}
