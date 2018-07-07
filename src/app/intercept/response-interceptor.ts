import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

  @Injectable()
  export class ResponseInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log('Catch request in ResponseInterceptor');
      return next
        .handle(req)
        // .do(
        //   (event: HttpEvent<any>) => {
        //     if (event instanceof HttpResponse) {
        //       console.log('Receive response:\n', event);
        //     }
        //   }
        // );
        .pipe(
          tap(
            (event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                console.log('Receive response:\n', event);
              }
            },
            (error: HttpErrorResponse) => {
              console.log('error: ' + error.message);
            }
          )
        );
    }
  }



