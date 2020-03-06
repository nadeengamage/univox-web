import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Setting Headers for API Request
   */
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }

  /**
   * set multipart headers empty headers
   */
  private setHeadersMultiPart(): HttpHeaders {
    const headersConfig = {};
    return new HttpHeaders(headersConfig);
  }

  /**
   * format errors
   */
  private formatErrors(error) {
    return throwError(error.error);
  }

  get(path, params?): Observable<any> {
    return this.httpClient
      .get(path, {
        headers: this.setHeaders(),
        params
      })
      .pipe(
        map(res => res),
        catchError(this.formatErrors)
      );
  }

  post(path, body, params?): Observable<any> {
    return this.httpClient
      .post(path, JSON.stringify(body), {
        headers: this.setHeaders(),
        params
      })
      .pipe(
        map(res => res),
        catchError(this.formatErrors)
      );
  }

  put(path, body, params?): Observable<any> {
    return this.httpClient
      .put(path, JSON.stringify(body), {
        headers: this.setHeaders(),
        params
      })
      .pipe(
        map(res => res),
        catchError(this.formatErrors)
      );
  }

  delete(path, params?): Observable<any> {
    return this.httpClient
      .delete(path, {
        headers: this.setHeaders(),
        params
      })
      .pipe(
        map(res => res),
        catchError(this.formatErrors)
      );
  }

  multiPart(path, body, params?): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('files', body);
    return this.httpClient
      .post(path, formData, {
        headers: this.setHeadersMultiPart(),
        params
      })
      .pipe(
        map(res => res),
        catchError(this.formatErrors)
      );
  }
}
