import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  data: Object;
  loading: boolean;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  makeRequest(): void {
    this.loading = true;
    this.http.get('http://jsonplaceholder.typicode.com/posts/1', {observe: 'response'})
      .subscribe(data => {
        this.data = data;
        this.loading = false;
      });
  }

}
