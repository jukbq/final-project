import { Component, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { doc } from 'firebase/firestore';
import { AdressComponent } from 'src/app/modals-win/adress/adress.component';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
})
export class PersonalDataComponent implements OnInit {
  public userForn!: FormGroup;
  public firstName = '';
  public lastName = '';
  public birthdate!: number;
  public phone!: number;
  public email = '';
  public password = '';
  public user: any;
  public addressArr: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private afs: Firestore,
    private auth: Auth,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.logFormInit();
    this.userInfo();
  }

  logFormInit(): void {
    this.userForn = this.formBuilder.group({
      firstname: [null],
      lastname: [null],
      birthdate: [null],
      phone: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null],
    });
  }

  userInfo() {
    this.user = JSON.parse(localStorage.getItem('curentUser') as string);
    let userInfo = this.user;
    this.addressArr = this.user.address;
    if (userInfo) {
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.birthdate = userInfo.birthdate;
      this.phone = userInfo.phone;
      this.email = userInfo.email;
      this.password = userInfo.password;
      this.userForn.patchValue({
        firstname: this.firstName,
        lastname: this.lastName,
        birthdate: this.birthdate,
        phone: this.phone,
        email: this.email,
        password: this.password,
      });
    }
 /*    console.log(this.user);
    console.log(this.addressArr); */
  }

  updateUser() {
    const { email, password } = this.userForn.value;
    this.updateUserData(email, password);
  }

  async updateUserData(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    if (this.user) {
      this.user.firstName = this.userForn.value.firstname;
      this.user.lastName = this.userForn.value.lastname;
      this.user.birthdate = this.userForn.value.birthdate;
      this.user.phone = this.userForn.value.phone;
      this.user.email = this.userForn.value.email;
    }

    const userDocRef = doc(this.afs, 'users', userCredential.user.uid);
    setDoc(userDocRef, this.user)
      .then(() => {
        localStorage.setItem('curentUser', JSON.stringify(this.user));
        console.log('Дані користувача оновлено');
      })
      .catch((error) => {
        console.error('Помилка під час оновлення даних', error);
      });
  }

  addressModal(action: 'add' | 'edit', id?: number): void {
    const dialogRef = this.dialog.open(AdressComponent, {
      panelClass: 'address_maoa_dialog',
      data: { action, id },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.userInfo(); // Викликайте метод userInfo після закриття модального вікна
    });
  }
}
