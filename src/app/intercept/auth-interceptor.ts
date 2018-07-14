import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log('Catch request in AuthInterceptor');

      const customReq = req.clone({
        headers: req.headers.set('Authorization', '_ban_anh_Quy_')
      });

      // req.headers.set('Authorization', '_ban_anh_Quy_');

      return next.handle(customReq);
    }
  }



