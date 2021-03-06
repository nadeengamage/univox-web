import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './authentication.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        if (authToken !== null) {
        req = req.clone({
            setHeaders: {
                Authorization: 'JWT ' + authToken
            }
        });
        return next.handle(req);
        } else {
            req = req.clone({
                setHeaders: {}
            });
            return next.handle(req);
        }
    }
}
