import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerClickSubject = new Subject<void>();
  headerClick$ = this.headerClickSubject.asObservable();

  emitHeaderClick() {
    this.headerClickSubject.next();
  }
}
