import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MemberListComponent} from './components/member-list/member-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MyInterceptor} from './intercept/my-interceptor';
import {AuthInterceptor} from './intercept/auth-interceptor';
import {ResponseInterceptor} from './intercept/response-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MemberListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
