import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
})
export class PersonalDataComponent implements OnInit {
  public sighUoForn!: FormGroup;
  public firstName = '';
  public lastName = '';
  public phone!: number;
  public email = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.logFormInit();
    this.userIndo();
  }

  logFormInit(): void {
    this.sighUoForn = this.formBuilder.group({
      firstname: [null],
      lastname: [null],
      phone: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      password2: [null, [Validators.required]],
    });
  }

  userIndo() {
    let user = JSON.parse(localStorage.getItem('curentUser') as string);
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.phone = user.phone;
      this.email = user.email;
    }
  }


}
