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
  public userForm!: FormGroup; // Форма для введення даних користувача
  public firstName = ''; // Ім'я користувача
  public lastName = ''; // Прізвище користувача
  public birthdate!: number; // Дата народження користувача
  public phone!: number; // Телефон користувача
  public email = ''; // Email користувача
  public password = ''; // Пароль користувача
  public user: any; // Об'єкт, що зберігає дані користувача
  public userAddress: any = []; // Адреси користувача
  public addressArr: any = []; // Масив адрес користувача

  constructor(
    private formBuilder: FormBuilder,
    private afs: Firestore,
    private auth: Auth,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm(); // Ініціалізація форми при завантаженні компонента
    this.getUserInfo(); // Отримання інформації про користувача
  }

  // Ініціалізація форми для введення даних користувача
  initForm(): void {
    this.userForm = this.formBuilder.group({
      firstname: [null],
      lastname: [null],
      birthdate: [null],
      phone: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null],
    });
  }

  // Отримання інформації про користувача з локального сховища
  getUserInfo() {
    this.user = JSON.parse(localStorage.getItem('curentUser') as string);
    let userInfo = this.user; // Інформація про користувача
    this.addressArr = this.user.address; // Масив адрес користувача
    if (userInfo) {
      this.firstName = userInfo.firstName;
      this.lastName = userInfo.lastName;
      this.birthdate = userInfo.birthdate;
      this.phone = userInfo.phone;
      this.email = userInfo.email;
      this.password = userInfo.password;
      this.userForm.patchValue({
        firstname: this.firstName,
        lastname: this.lastName,
        birthdate: this.birthdate,
        phone: this.phone,
        email: this.email,
        password: this.password,
      });
    }
  }

  // Оновлення даних користувача
  updateUser() {
    const { email, password } = this.userForm.value;
    this.updateUserData(email, password);
  }

  // Оновлення даних користувача на сервері
  async updateUserData(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    if (this.user) {
      this.user.firstName = this.userForm.value.firstname;
      this.user.lastName = this.userForm.value.lastname;
      this.user.birthdate = this.userForm.value.birthdate;
      this.user.phone = this.userForm.value.phone;
      this.user.email = this.userForm.value.email;
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

  // Відкриття модального вікна для додавання або редагування адреси
  addressModal(action: 'add' | 'edit', id?: number): void {
    const dialogRef = this.dialog.open(AdressComponent, {
      panelClass: 'address_maoa_dialog',
      data: { action, id },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUserInfo(); // Оновлення інформації про користувача після закриття модального вікна
      this.updateUser(); // Оновлення даних користувача на сервері
    });
  }

  // Видалення адреси користувача
  delAddres(id?: number): void {
    this.userAddress = JSON.parse(localStorage.getItem('curentUser') as string);
    if (id !== undefined) {
      const index = id;
      if (index >= 0 && index < this.userAddress.address.length) {
        const editAddress = this.userAddress.address[index]; // Адреса, яка видаляється
        this.userAddress.address.splice(index, 1);
        localStorage.setItem('curentUser', JSON.stringify(this.userAddress));
        this.getUserInfo(); // Оновлення інформації про користувача після видалення адреси
        this.updateUser(); // Оновлення даних користувача на сервері
      }
    }
  }
  shouldShowError(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return (control?.invalid && (control.dirty || control.touched)) || false;
  }
}
