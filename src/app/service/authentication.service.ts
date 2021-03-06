import { Injectable } from '@angular/core';
import { HttpUtilsService } from './http-utils.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user';
import { NotifierService } from 'angular-notifier';
import { error } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  endpoint = '/api/v1/auth';
  userendpoint = '/api/v1/users';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser;
  loading = false;

  constructor(
    private http: HttpClient,
    public router: Router,
    private notifier: NotifierService
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    const api = `${this.endpoint}/register-user`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.access_token);
        this.getUserProfile(user).subscribe((response) => {
            for (const element of response.data) {
              if (element.username === user.username) {
                this.currentUser = element.username;
                this.router.navigate(['univox']);
                this.notifier.notify('success', 'Welcome back! ' + this.currentUser);
                this.hideLoading();
                break;
              }
            }
        });
      },
      res => {
        this.notifier.notify('error', res.error.description);
      });
  }

  hideLoading() {
    if (this.currentUser !== null) {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['signin']);
      this.notifier.notify('default', 'See yaa! ' + this.currentUser);
    }
  }

  // User profile
  getUserProfile(username): Observable<any> {
    const api = `${this.userendpoint}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(res: HttpErrorResponse) {
    let msg = '';
    if (res.error instanceof ErrorEvent) {
      // client-side error
      msg = res.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${res.error.status}\nMessage: ${res.error.message}`;
    }
    return throwError(msg);
  }
}
