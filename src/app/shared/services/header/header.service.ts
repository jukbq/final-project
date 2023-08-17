import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerClickSubject = new Subject<string>();
  headerClick$ = this.headerClickSubject.asObservable();

  emitHeaderClick(menuItem: string) {
    this.headerClickSubject.next(menuItem);
  }
}
