import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {RouterModule} from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';


const MATERIAL = [
  MatSliderModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatExpansionModule,


];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MATERIAL,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ...MATERIAL,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }],
})
export class SharedModule {}
