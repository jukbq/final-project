import { Component, ElementRef, ViewChild } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection } from 'firebase/firestore';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent {
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

  removeFile() {
    this.selectedFile = undefined;
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
     console.log(faqCollectionRef);
     
   try {
     const docRef = await addDoc(faqCollectionRef, faq);
     console.log('Документ успешно добавлен с ID:', docRef.id);
   } catch (error) {
     console.error('Ошибка при добавлении документа:', error);
   }


    
  }
}
