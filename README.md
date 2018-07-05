# HttpClient - Angular 4 tutorial

## Mở đầu

HttpClient là một module trong Angular core, nó cung cấp cho ta các 
cách thức để làm việc với http.

Trước khi đi vào chi tiết, cần nhớ rằng ta có 2 module làm việc với Http, 
đó là Http module và HttpClient module. Từ angular 4.3 HttpClient modudle được bổ sung 
cung cấp thêm nhiều tính năng hơn (progress events, json deserialization by default, Interceptors 
và nhiều tính năng hay ho hơn) tham khảo thêm trên https://angular.io/guide/http. 
Còn Http module chỉ là API cũ và đã bị đánh dấu deprecated (ở version 5)

Sẽ sử dụng HttpClient modudle trong các dự án Angular 4 và 4+

HttpClient nằm trong `@angular/common/http` 

`@angular/common/http` cung cấp API nhằm đơn giản hóa cho thao tác với Http
built on top trên `XMLHttpRequest` interface trên browsers. Lợi ích của việc 
sử dụng HttpClient đó là: testability support, strong typing of request and response objects, 
request and response interceptor support, and better error handling via apis based on Observables.

## Implementation

Cũng giống với việc sử dụng các modules trong Angular, các bước thực hiện:

B1. Cần có một project angular 

B2. Khai báo HttpClientModule trong AppModule hoặc sub module trong ứng dụng

```
...
import {HttpClientModule} from '@angular/common/http';
...

@NgModule({
  imports: [
    BrowserModule,
    // Include it under 'imports' in your application module
    // after BrowserModule.
    HttpClientModule,
  ],
})
...

```

B3. Tạo Http request

Trước tiên cần inject HttpClient vào trong component, sau đó thực hiện request
với method muốn sử dụng.

Một ví dụ đơn giản cho việc lấy thông tin user với request là 
`http://jsonplaceholder.typicode.com/posts/1`

```
  constructor(private http: HttpClient) {
  }

  makeRequest(): void {
    this.loading = true;
    this.http.get('http://jsonplaceholder.typicode.com/posts/1')
      .subscribe(data => {
        // do st with data
      });
  }
```

Như vậy, cách dùng HttpClient khá là đơn giản, phần tiếp theo sẽ đi tới chi tiết
hơn về một số feature mà HttpClient cung cấp

## Observables trong Angular

Trong ví dụ trên, ta thấy rằng: sau khi HttpClient thực hiện phương thức `.get(...)`
xong thì nó gọi tiếp `.subscribe(...)`

Nhìn vào code của `.get(..)` sẽ thấy 
```
    get(url: string, options?: {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    }): Observable<Object>;
```

`.get(...)` trả về một Observable

`Observable` trong Angular là một đối tượng được xây dựng sẵn, nó được thiết kế
theo Observer Design Pattern

Vì vậy, quay lại vấn đề trên, sau khi HttpClient gọi phương thức `.get(...)`, 
hệ thống sẽ lắng nghe, chờ cho tới khi response trả về, response đó sẽ được
xử lý trong function mà `.subscribe(...)` định nghĩa.

Tìm hiểu thêm về [Observables](https://angular.io/guide/observables)

Chú ý: 
- Observable có thể trả về một Promise
- Request chỉ gửi đi khi method `.subscribe(...)` được gọi.

## Các phương thức của HttpClient

Các method mà HttpClient support khá đơn giản, bao gồm:

- `request(...)`: thực hiện các request với input là `method`, `url`, `options`
- các phương thức còn lại chỉ là cụ thể hóa hơn so với `request(...)` bởi việc
định nghĩa sẵn method của request, đó là `get(...)`, `post(...)`, ... với input
là `url` và `options`
- Các `options` sẽ không đề cập ở đây, ta sẽ bổ sung dần khi tìm hiểu về những 
feature mà HttpClient cung cấp ở các phần dưới

## Typechecking the response

Khá giống với Generics trong Java

Vì response trả về chỉ là dạng một Object
muốn lấy ra thì ta cần phải lấy nó theo dạng `data['results']`. 
HttpClient cung cấp cơ chế giống như việc 
parse response trả về một shape đã được định nghĩa sẵn.

Ví dụ:
Ta khai báo một interface như một shape 
```
interface ItemsResponse {
  results: string[];
}
```
Tiếp đó là đánh dấu kiểu trả về cho response:

```
http.get<ItemsResponse>('/api/items').subscribe(data => {
  // data is now an instance of type ItemsResponse, so you can do this:
  this.results = data.results;
});
```

## Reading the full response

Với `options` như đã đề cập trước đó, ta có thể lấy ra đầy đủ dữ liệu trong 
response trả về (headers, status, body, ...) 

```
  makeRequest(): void {
    this.loading = true;
    this.http.get('http://jsonplaceholder.typicode.com/posts/1', {observe: 'response'})
      .subscribe(data => {
        console.log(resp.headers);
        console.log(resp.body);
      });
  }
```

## Error handling

Request gửi đi có thể bị xử lý lỗi trên server hoặc gián đoạn do network, vì thế
cần phải handle các lỗi này. Việc handle được định nghĩa trong `subscribe` 
*(câu nói này chưa được rõ ràng lắm)*

```
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    // Successful responses call the first callback.
    data => {...},
    // Errors will call this callback instead:
    err => {
      console.log('Something went wrong!');
    }
  );
```

Thay vì một Object không rõ ràng, ta có thể lấy được đối tượng Error khi lỗi trả về

```
http
  .get<ItemsResponse>('/api/items')
  .subscribe(
    data => {...},
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', err.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
      }
    }
  );
```

Ngoài ra, nhằm cứu rỗi request theo kiểu cố đấm ăn xôi, ta có thể yêu cầu HttpClient
thử request lại với số lần được khai báo sẵn. RxJs cung cấp method `.retry(n)`
giúp ta thực hiện việc đó, nó tự động resubscribe tới Observable và request lạid

```
import 'rxjs/add/operator/retry';
...
http
  .get<ItemsResponse>('/api/items')
  // Retry this request up to 3 times.
  .retry(3)
  // Any errors after the 3rd retry will fall through to the app.
  .subscribe(...);
```

## Requesting non-JSON data

Ở các ví dụ trước, các request đều trả về kiểu JSON, nhưng ta vẫn chó thể request
tới các kiểu dữ liệu khác:
 
```
http
  .get('/textfile.txt', {responseType: 'text'})
  // The Observable returned by get() is of type Observable<string>
  // because a text response was specified. There's no need to pass
  // a <string> type parameter to get().
  .subscribe(data => console.log(data));
```

## Configuring other parts of the request

### Post request với body

```
const body = {name: 'Brad'};

http
  .post('/api/developers/add', body)
  // See below - subscribe() is still necessary when using post().
  .subscribe(...);
```

### Headers

```
http
  .post('/api/items/add', body, {
    headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
  })
  .subscribe();
```

### URL parameters

```
http
  .post('/api/items/add', body, {
    params: new HttpParams().set('id', '3'),
  })
  .subscribe();
```


## Advanced usage

Phần nâng cao khi sử dụng với HttpClient, không chỉ đơn thuần là gửi và lấy dữ liệu

### Intercepting all requests or responses

Link docs: https://v4.angular.io/guide/http#intercepting-all-requests-or-responses

Hơi khó mô tả cho thằng này, có thể hiểu hôm na nó thiết kế theo tư tưởng AOP hay middleware (nodejs), 
bằng việc chặn được request trước khi gửi đi và response trước khi response nhận về ứng dụng, 
ta có thể xen vào và thực hiện một số action: authentication, logging, ...

### Implementations

Tạo class implement `HttpInterceptor`, override lại phương thức `intercept`
 
```
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
```

, cần nhớ rằng `intercept(...)` luôn phải `return next.handle(req);` để đảm bảo
luồng hoạt động sẽ tiếp tục chạy. Pattern này khá giống với middleware trong Nodejs.

Tiếp theo, ta cần khai báo nó trong module

```
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

@NgModule({
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: NoopInterceptor,
    multi: true,
  }],
})
export class AppModule {}
```

Nhờ việc override lại `intercept(...)` method mà ta có thể làm được khá nhiều
thứ hay ho trong đó: 
- Update headers: thêm Authorization, ...
- Logging: log lại thông tin các request
- Caching: cache lại các request, response
- ...
*(Chi tiết hơn ở trong code demo)*

## Security: XSRF Protection

*(Phần này chưa tìm hiểu kỹ)*

HttpClient có support cơ chế bảo vệ ngăn chặn tấn công XSRF

Configuring custom cookie/header names *(Chưa hiểu cần custom để làm gì)*

```
imports: [
  HttpClientModule,
  HttpClientXsrfModule.withConfig({
    cookieName: 'My-Xsrf-Cookie',
    headerName: 'My-Xsrf-Header',
  }),
]
```


## Testing HTTP requests

*(Phần này sẽ nằm ở code demo, chỉ show ra cho mọi người biết nó như thế nào, 
chứ không đề cập tới chi tiết)*

HttpClient support cho việc mock test khá là tiện dụng.

## Bonus: HttpClient vs Http

Phần này bonus thêm, đối với những người đã từng sử dụng Angular ở những version khác thì Http khá là quen thuộc
Tuy nhiên, như đã đề cập ở trước đó, Http đã bị đánh dấu deprecated
Ta sẽ có 1 chút so sánh, cũng như kết luận lại sự khác nhau giữa 2 thằng

[Tham khảo thêm](https://sergeome.com/blog/2017/11/26/simply-about-new-httpclient-in-angular/)

### New features

- Automatic conversion to from JSON to an object
- Response type definition
- Event firing
- Simplified syntax for headers
- Interceptors

### Migrate từ Http sang HttpClient trong application sử dụng version cũ

- Đầu tiên là cần đảm bảo rằng version của ta phải là 4.3 hoặc lớn hơn
- Trong Module cần replace `HttpModule` bằng `HttpClientModule`, cùng với đó là import đúng
gói `@angular/common/http`
- Tiếp theo là tới các service trong ứng dụng, replace `Http` bằng `HttpClient`

Đó là các bước cần thiết, required để thực hiện việc chuyển đổi, ngoài ra ta có thể thay đổi:
- Nếu set custom headers, ta nên viết lại chúng theo cú pháp mà HttpClient support (ở trên)

## Tài liệu tham khảo 

- https://v4.angular.io/guide/http (Ng4)
- https://angular.io/guide/http (latest)
