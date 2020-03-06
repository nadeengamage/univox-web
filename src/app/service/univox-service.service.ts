import { Injectable } from '@angular/core';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UnivoxService {

  private mainUrl = '/api/v1';
  private getUsers: string;
  private getFaculty: string;
  private getDegree: string;

  constructor(private http: HttpUtilsService) {
    this.getUsers = this.mainUrl + '/users';
    this.getFaculty = this.mainUrl + '/faculties';
    this.getDegree = this.mainUrl + '/degrees';
  }

  public getAllUsers() {
    const users = this.getUsers;
    return this.http.get(users);
  }

  public getAllFaculties() {
    const faculties = this.getFaculty;
    return this.http.get(faculties);
  }

  public getAllDegrees() {
    const degrees = this.getDegree;
    return this.http.get(degrees);
  }

}
