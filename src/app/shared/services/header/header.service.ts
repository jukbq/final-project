import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GoodsResponse } from '../../interfaces/goods';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private basketDataSubject = new BehaviorSubject<Array<GoodsResponse>>([]);
  basketData$ = this.basketDataSubject.asObservable();

  private headerClickSubject = new Subject<string>();
  headerClick$ = this.headerClickSubject.asObservable();

  private pageInfoSubject = new Subject<any>();
  pageInfo$ = this.pageInfoSubject.asObservable();

  emitHeaderClick(menuItem: string) {
    this.headerClickSubject.next(menuItem);
  }

  emitPageInfo(pageInfo: any) {
    this.pageInfoSubject.next(pageInfo);
  }

  updateBasketData(newData: Array<GoodsResponse>) {
     this.basketDataSubject.next(newData);
    }
}
