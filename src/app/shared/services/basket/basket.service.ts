import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private summSubject = new Subject<number>();
  private countSubject = new Subject<number>();
  summ$ = this.summSubject.asObservable();
  count$ = this.countSubject.asObservable();

  updateSumm(summ: number) {
    this.summSubject.next(summ);
  }

  updateCount(count: number) {
    this.countSubject.next(count);
  }
}
