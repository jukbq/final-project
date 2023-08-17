import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from 'src/app/modals-win/signin/signin.component';

@Injectable({
  providedIn: 'root',
})
export class DilogService {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(SigninComponent, {
      width: '250px'
    });
  }
}
