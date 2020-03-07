import { Injectable } from '@angular/core';
import { HttpUtilsService } from './http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class UnivoxService {

  private mainUrl = '/api/v1';

  private getUsersEndPoint: string;
  private createUserEndPoint: string;
  private getUsersByIdEndPoint: string;
  private updateUsersEndPoint: string;
  private deleteUsersEndPoint: string;

  private getFacultyEndPoint: string;
  private createFacultyEndPoint: string;
  private getFacultyByIdEndPoint: string;
  private updateFacultyEndPoint: string;
  private deleteFacultyEndPoint: string;

  private getDegreeEndPoint: string;
  private createDegreeEndPoint: string;
  private getDegreeByIdEndPoint: string;
  private updateDegreeEndPoint: string;
  private deleteDegreeEndPoint: string;

  private getCriteriaEndPoint: string;
  private createCriteriaEndPoint: string;
  private getCriteriaByIdEndPoint: string;
  private updateCriteriaEndPoint: string;
  private deleteCriteriaEndPoint: string;

  constructor(private http: HttpUtilsService) {
    // USERS
    this.getUsersEndPoint = this.mainUrl + '/users';
    this.createUserEndPoint = this.mainUrl + '/users';
    this.getUsersByIdEndPoint = this.mainUrl + '/users';
    this.updateUsersEndPoint = this.mainUrl + '/users/{id}';
    this.deleteUsersEndPoint = this.mainUrl + '/users/{id}';

    // FACULTY
    this.getFacultyEndPoint = this.mainUrl + '/faculties';
    this.createFacultyEndPoint = this.mainUrl + '/faculties';
    this.getFacultyByIdEndPoint = this.mainUrl + '/faculties';
    this.updateFacultyEndPoint = this.mainUrl + '/faculties';
    this.deleteFacultyEndPoint = this.mainUrl + '/faculties';

    // DEGREE
    this.getDegreeEndPoint = this.mainUrl + '/degrees';
    this.createDegreeEndPoint = this.mainUrl + '/degrees';
    this.getDegreeByIdEndPoint = this.mainUrl + '/degrees';
    this.updateDegreeEndPoint = this.mainUrl + '/degrees';
    this.deleteDegreeEndPoint = this.mainUrl + '/degrees';

    // CRITERIA
    this.getCriteriaEndPoint = this.mainUrl + '/criterias';
    this.createCriteriaEndPoint = this.mainUrl + '/criterias';
    this.getCriteriaByIdEndPoint = this.mainUrl + '/criterias';
    this.updateCriteriaEndPoint = this.mainUrl + '/criterias';
    this.deleteCriteriaEndPoint = this.mainUrl + '/criterias';
  }

  public getAllUsers() {
    const get = this.getUsersEndPoint;
    return this.http.get(get);
  }
  public createUser(data) {
    const create = this.createUserEndPoint;
    return this.http.post(create, data);
  }
  public getUserById() {
    const getUserById = this.getUsersByIdEndPoint;
    return this.http.get(getUserById);
  }
  public updateUserById(id, data) {
    const updateUserById = this.updateUsersEndPoint.replace(
      '{id}', id
    );
    return this.http.put(updateUserById, data);
  }
  public deleteUser(id, status) {
    const deleteUser = this.deleteUsersEndPoint.replace(
      '{id}', id
    );
    return this.http.delete(deleteUser, status);
  }

  public getAllFaculties() {
    const faculties = this.getFacultyEndPoint;
    return this.http.get(faculties);
  }
  public createFaculty(data) {
    const create = this.createFacultyEndPoint;
    return this.http.post(data, create);
  }
  public getFacultyById() {
    const getFacultyById = this.getFacultyByIdEndPoint;
    return this.http.get(getFacultyById);
  }
  public updateFacultyById(data) {
    const updateFacultyById = this.updateFacultyEndPoint;
    return this.http.put(data, updateFacultyById);
  }
  public deleteFaculty(data) {
    const deleteFaculty = this.deleteFacultyEndPoint;
    return this.http.delete(data, deleteFaculty);
  }

  public getAllDegrees() {
    const degrees = this.getDegreeEndPoint;
    return this.http.get(degrees);
  }
  public createDegree(data) {
    const create = this.createDegreeEndPoint;
    return this.http.post(data, create);
  }
  public getDegreeById() {
    const getDegreeById = this.getDegreeByIdEndPoint;
    return this.http.get(getDegreeById);
  }
  public updateDegreeById(data) {
    const updateDegreeById = this.updateDegreeEndPoint;
    return this.http.put(data, updateDegreeById);
  }
  public deleteDegree(data) {
    const deleteDegree = this.deleteDegreeEndPoint;
    return this.http.delete(data, deleteDegree);
  }

  public getAllCriterias() {
    const criteria = this.getCriteriaEndPoint;
    return this.http.get(criteria);
  }
  public createCriteria(data) {
    const create = this.createCriteriaEndPoint;
    return this.http.post(data, create);
  }
  public getCriteriaById() {
    const getCriteriaById = this.getCriteriaByIdEndPoint;
    return this.http.get(getCriteriaById);
  }
  public updateCriteriaById(data) {
    const updateCriteriaById = this.updateCriteriaEndPoint;
    return this.http.put(data, updateCriteriaById);
  }
  public deleteCriteria(data) {
    const deleteCriteria = this.deleteCriteriaEndPoint;
    return this.http.delete(data, deleteCriteria);
  }

}
