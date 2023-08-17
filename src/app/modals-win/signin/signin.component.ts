import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { observable, Subscription } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ROLE } from 'src/app/shared/guards/role.constant';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  
})
export class SigninComponent {
  public loginForm!: FormGroup;
  public user: any;
  public loginSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: Auth,
    private afs: Firestore,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SigninComponent>
  ) {}

  logFormInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.logFormInit();
  }

  loginUser(): void {
    const { email, password } = this.loginForm.value;
    this.login(email, password)
      .then(() => {})
      .catch((e) => {});
  }

  async login(email: string, password: string): Promise<void> {
    const curent = await signInWithEmailAndPassword(this.auth, email, password);

    this.loginSubscription = docData(
      doc(this.afs, 'users', curent.user.uid)
    ).subscribe((user) => {
      this.user = user;
      const curentUser = { ...user, uid: curent.user.uid };
      localStorage.setItem('curentUser', JSON.stringify(user));

      this.actuve();
    });
  }
  actuve(): void {
    if (this.user && this.user.role === ROLE.USER) {
      this.close();
      this.router.navigate(['/user-cabinet']);
    } else if (this.user && this.user.role === ROLE.ADMIN) {
      this.close();
      this.router.navigate(['/admin']);
    }
  }

  sighUpMaoal(): void {
    this.close();
    this.dialog.open(SignupComponent, {
      panelClass: 'sigh_maoa_dialog',
    });
  }
  close(): void {
    this.dialogRef.close();
  }
}
