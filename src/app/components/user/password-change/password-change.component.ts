import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, updatePassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css'],
})
export class PasswordChangeComponent {
  public passwordChangeForm!: FormGroup;
  public errorPass = false;
  public errorMessage = '';
  public successMessage = '';
  public email = '';
  public oldPassword = '';
  public uid = '';
  public oldPassError = false;
  public errorOldPassEnter = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private afs: Firestore
  ) {}

  ngOnInit(): void {
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    this.email = customer.email;
    this.oldPassword = customer.password;
    this.uid = customer.uid;
    console.log(this.oldPassword);
    this.passFormInit();
  }

  passFormInit(): void {
    this.passwordChangeForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      password2: [null, [Validators.required]],
    });
  }

  checkEnterdPassword() {
    const oldPassword = this.passwordChangeForm.get('oldPassword')?.value;
    const newPassword = this.passwordChangeForm.get('password')?.value;
    if (oldPassword !== this.oldPassword) {
      this.oldPassError = true;
      this.passwordChangeForm.get('oldPassword')?.reset();
    } else {
      this.oldPassError = false;
    }

    if (newPassword === this.oldPassword) {
      this.errorOldPassEnter = true;
      this.passwordChangeForm.get('password')?.reset();
    } else {
      this.errorOldPassEnter = false;
    }
  }

  async passChange() {
    const oldPassword = this.passwordChangeForm.get('oldPassword')?.value;
    const newPassword = this.passwordChangeForm.get('password')?.value;
    const confirmPassword = this.passwordChangeForm.get('password2')?.value;
    const userDocRef = doc(this.afs, 'users', this.uid);
    console.log(userDocRef);
    const dataToUpdate = {
      password: newPassword,
    };
    try {
      await updateDoc(userDocRef, dataToUpdate);
      console.log('Документ оновлено успішно');
    } catch (error) {
      console.error('Помилка під час оновлення документа:', error);
    }
  }
}
