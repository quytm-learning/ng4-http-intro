import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
// import 'rxjs/add/operator/retry';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  data: UserItemResponse;
  loading: boolean;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  makeRequest(): void {
    const url = 'http://jsonplaceholder.typicode.com/posts/1';
    this.http.get<UserItemResponse>(url)
      .subscribe(data => {
        this.data = data;
      });
  }


  makeRequest2(): void {
    const url = 'http://jsonplaceholder.typicode.com/posts/1';
    this.http.get<UserItemResponse>(url)
      .subscribe(
        // Successful responses call the first callback.
        data => {},
        // Errors will call this callback instead:
        // (err: HttpErrorResponse) => {
        err => {
          console.log('Something went wrong!');
        }
      );
  }

  // makeRequest3(): void {
  //   const url = 'http://jsonplaceholder.typicode.com/posts/1';
  //   this.http.get<UserItemResponse>(url)
  //     .retry(3)
  //     .subscribe(
  //     );
  // }

  makeRequest4(): void {
    this.http
      .get('/textfile.txt', {responseType: 'text'})
      // The Observable returned by get() is of type Observable<string>
      // because a text response was specified. There's no need to pass
      // a <string> type parameter to get().
      .subscribe(data => console.log(data));
  }


}

interface UserItemResponse {
  userId: string;
  id: string;
  title: string;
  body: string;
}


