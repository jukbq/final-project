import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ROLE } from 'src/app/shared/guards/role.constant';
import { SignupComponent } from '../signup/signup.component';
import { doc } from 'firebase/firestore';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    this.logFormInit();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  logFormInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  loginUser(): void {
    const { email, password } = this.loginForm.value;
    this.login(email, password)
      .then(() => {
        console.log('Користувач успішно автроризувався');
      })
      .catch((e) => {
        console.log('Невірний email або пароль');
      });
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    this.loginSubscription = docData(
      doc(this.afs, 'users', userCredential.user.uid)
    ).subscribe((user) => {
      this.user = user;
      const curentUser = { ...user, uid: userCredential.user.uid };
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
      this.router.navigate(['/admin/']);
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
