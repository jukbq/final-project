import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.css'],
})
export class AdressComponent {
  public addressForn!: FormGroup;
  public userAddress: any = [];
  public type = '';
  public city = '';
  public street = '';
  public houseNumber!: number;
  public entrance!: number;
  public floor!: number;
  public apartment!: number;
  public activeForm = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AdressComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { action: 'add' | 'edit'; id?: number }
  ) {}

  ngOnInit(): void {
    if (this.data.action === 'edit') {
      this.activeForm = true;
      this.userAddressInfo();
      this.addressFormInit();
    } else {
      this.addressFormInit();
      console.log(this.data.action);
    }
  }

  // Ініціалізація форми адреси
  addressFormInit(): void {
    this.addressForn = this.formBuilder.group({
      type: [null, [Validators.required]],
      city: [null, [Validators.required]],
      street: [null, [Validators.required]],
      houseNumber: [null, [Validators.required]],
      entrance: [null],
      floor: [null],
      apartment: [null],
    });
  }

  // Отримання інформації про адреси користувача
  userAddressInfo() {
    this.userAddress = JSON.parse(localStorage.getItem('curentUser') as string);
    if (this.data.id !== undefined) {
      const index = this.data.id;
      if (index >= 0 && index < this.userAddress.address.length) {
        const editAddress = this.userAddress.address[index];

        console.log(editAddress.type);
        console.log(this.data.id);
        console.log(this.userAddress);

        // Заповнення форми існуючими даними адреси для редагування
        this.addressForn.patchValue({
          type: editAddress.type,
          city: editAddress.city,
          street: editAddress.street,
          houseNumber: editAddress.houseNumber,
          entrance: editAddress.entrance,
          floor: editAddress.floor,
          apartment: editAddress.apartment,
        });
      }
    }
  }

  // Додавання нової адреси
  addAddress() {
    this.type = this.addressForn.value.type;
    this.city = this.addressForn.value.city;
    this.street = this.addressForn.value.street;
    this.houseNumber = this.addressForn.value.houseNumber;
    this.entrance = this.addressForn.value.entrance;
    this.floor = this.addressForn.value.floor;
    this.apartment = this.addressForn.value.apartment;
    const addressData = {
      type: this.type,
      city: this.city,
      street: this.street,
      houseNumber: this.houseNumber,
      entrance: this.entrance,
      floor: this.floor,
      apartment: this.apartment,
    };

    const currentUser = JSON.parse(localStorage.getItem('curentUser') || '{}');
    const userAddresses = currentUser.address || [];
    userAddresses.push(addressData);
    localStorage.setItem('curentUser', JSON.stringify(currentUser));
    this.dialogRef.close();
  }

  // Редагування існуючої адреси
  editAddress() {
    const updatedAddress = {
      type: this.addressForn.value.type,
      city: this.addressForn.value.city,
      street: this.addressForn.value.street,
      houseNumber: this.addressForn.value.houseNumber,
      entrance: this.addressForn.value.entrance,
      floor: this.addressForn.value.floor,
      apartment: this.addressForn.value.apartment,
    };

    const currentUser = JSON.parse(localStorage.getItem('curentUser') || '{}');

    if (this.data.id !== undefined) {
      const index = this.data.id;

      if (index >= 0 && index < currentUser.address.length) {
        currentUser.address[index] = updatedAddress;
        localStorage.setItem('curentUser', JSON.stringify(currentUser));
        this.dialogRef.close();
      }
    }
  }

  // Закриття діалогового вікна
  close(): void {
    this.dialogRef.close();
  }
}
