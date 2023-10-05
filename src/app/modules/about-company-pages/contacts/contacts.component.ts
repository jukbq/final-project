import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  public customerForm!: FormGroup;
  public selectedFile: File | undefined;

  constructor(private formBuilder: FormBuilder, private afs: Firestore) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.customerForm = this.formBuilder.group({
      firstname: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      comment: [null],
    });
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  async checkout() {
    const faq = {
      firstname: this.customerForm.value.firstname,
      phone: this.customerForm.value.phone,
      email: this.customerForm.value.email,
      comment: this.customerForm.value.comment,
      selectedFile: this.selectedFile || null,
    };
    const faqCollectionRef = collection(this.afs, 'faq');

    try {
      const docRef = await addDoc(faqCollectionRef, faq);
      console.log('Документ успешно добавлен с ID:', docRef.id);
    } catch (error) {
      console.error('Ошибка при добавлении документа:', error);
    }
  }
}
