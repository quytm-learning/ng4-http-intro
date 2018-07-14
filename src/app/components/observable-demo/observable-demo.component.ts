import {Component, OnInit} from '@angular/core';
import {
  Observable,
  Subject,
  asapScheduler,
  pipe,
  of,
  from,
  interval,
  merge,
  fromEvent,
  SubscriptionLike,
  PartialObserver,
  Observer, timer
} from 'rxjs';
import {map, filter, timeInterval} from 'rxjs/operators';
import {ajax} from 'rxjs/ajax';


@Component({
  selector: 'app-observable-demo',
  templateUrl: './observable-demo.component.html',
  styleUrls: ['./observable-demo.component.scss']
})
export class ObservableDemoComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    // this.basic();
    // this.subscribeUsingObserver();
    // this.creatingObservables();
    // this.customFromEvent();
    // this.fromPromise();
    // this.fromAjaxRequest();
    // this.mapOperators();
    // this.filterOperator();
  }

  basic() {
    from([1, 2, 3, 4])
      .subscribe(console.log);
    from('RxJS')
      .subscribe(console.log);
    of(9, 8, 7)
      .subscribe(console.log);
    of('Hello', 'RxJS', 'error', 'er').subscribe(
      next => {
        console.log(next);
        if (next === 'error')
          throw new Error(next);
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('completed!');
      }
    );
    // let observer: any = {
    //   next: function (data) {
    //     // next
    //   },
    //   error: function (errorMsg) {
    //
    //   },
    //   complete: function () {
    //     //... log, noti
    //   }
    // }
  }

  subscribeUsingObserver() {
    // Create simple observable that emits three values
    const myObservable = of(1, 2, 3);

    // Create observer object
    const myObserver = {
      next: x => console.log('Observer got a next value: ' + x),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    // Execute with the observer object
    myObservable.subscribe(myObserver);

    // Logs:
    // Observer got a next value: 1
    // Observer got a next value: 2
    // Observer got a next value: 3
    // Observer got a complete notification
  }

  // creatingObservables() {
  //   // This function runs when subscribe() is called
  //   function sequenceSubscriber(observer) {
  //     // synchronously deliver 1, 2, and 3, then complete
  //     observer.next(1);
  //     observer.next(2);
  //     observer.next(3);
  //     observer.complete();
  //
  //     // unsubscribe function doesn't need to do anything in this
  //     // because values are delivered synchronously
  //     return {
  //       unsubscribe() {
  //       }
  //     };
  //   }
  //
  //   // Create a new Observable that will deliver the above sequence
  //   const sequence = new Observable(sequenceSubscriber);
  //
  //   // execute the Observable and print the result of each notification
  //   sequence.subscribe({
  //     next(num) {
  //       console.log(num);
  //     },
  //     complete() {
  //       console.log('Finished sequence');
  //     }
  //   });
  // }


  customFromEvent() {
    const ESC_KEY = 27;
    const nameInput = document.getElementById('name-box') as HTMLInputElement;

    const subscription = fromEvent(nameInput, 'keydown')
      .subscribe((e: KeyboardEvent) => {
        console.log(e.key);
        if (e.keyCode === ESC_KEY) {
          nameInput.value = '';
        }
      });
  }

  fromPromise() {
    const fortyTwo = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(42);
        console.log("run..");
      }, 5000);
    });
    from(fortyTwo)
      .subscribe(console.log);
    console.log('Program terminated');

    // const promise = new Promise(() => {
    //   console.log("call cmnr");
    // });
  }

  fromAjaxRequest() {
    const apiData = ajax('http://jsonplaceholder.typicode.com/posts/1');
    apiData.subscribe(
      res => console.log(res.status, res.response)
    );
  }


  // ----------------------------------------------------------------------------------

  mapOperators() {
    const nums = of(1, 2, 3);

    const squareValues = map((val: number) => val * val);
    const squaredNums = squareValues(nums);

    squaredNums.subscribe(x => console.log(x));
  }

  filterOperator() {
    const nums = of(1, 2, 3, 4, 5);

    const squareOddVals =
      pipe(
        filter((n: number) => (n % 2) === 0),
        map(n => n * n)
      );

    const squareOdd = squareOddVals(nums);

    setTimeout(() => {

    });
    squareOdd
      .subscribe(x => console.log(x));
  }

}
