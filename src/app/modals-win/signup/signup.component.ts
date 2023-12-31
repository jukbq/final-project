import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { ROLE } from 'src/app/shared/guards/role.constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  public sighUoForn!: FormGroup;
  public user: any;
  public errorPass = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router,
    private afs: Firestore,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignupComponent>
  ) { }

  ngOnInit(): void {
    this.logFormInit();
  }

  logFormInit(): void {
    this.sighUoForn = this.formBuilder.group({
      firstname: [null],
      lastname: [null],
      birthdate: [null],
      phone: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      password2: [null, [Validators.required]],
      userBonus: [0],
    });
  }

  userRegister() {
    const pass = this.sighUoForn.value.password;
    const pass2 = this.sighUoForn.value.password2;
    if (pass !== pass2) {
      this.errorPass = true;
      console.log('Введені паролі не співпадають');
    } else {
      const { email, password } = this.sighUoForn.value;
      this.enailSighUp(email, password)
        .then(() => {
          console.log('Користувача успішно зареэстровано');
          this.active();
        })
        .catch((e) => {
          console.log('Корситувача з такою адресою вже зареєстровано');
        });
    }
  }

  async enailSighUp(email: string, password: string): Promise<any> {
    const userReg = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = {
      address: [],
      email: userReg.user.email,
      password: password,
      firstName: this.sighUoForn.value.firstname,
      lastName: this.sighUoForn.value.lastname,
      phone: this.sighUoForn.value.phone,
      birthdate: this.sighUoForn.value.birthdate,
      role: 'USER',
      userBonus: 0,
    };
    await setDoc(doc(this.afs, 'users', userReg.user.uid), user);
    localStorage.setItem('curentUser', JSON.stringify(user));


  }

  active(): void {
    this.close();
    window.location.href = '/user';
  }

  sighInMaoal(): void {
    this.close();
    this.dialog.open(SigninComponent, {
      panelClass: 'sigh_maoa_dialog',
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
