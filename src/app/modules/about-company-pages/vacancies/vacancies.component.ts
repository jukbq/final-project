import { Component, ElementRef, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, collection } from 'firebase/firestore';


@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css'],
})
export class VacanciesComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  public customerForm!: FormGroup;
  public selectedFile: File | undefined;
  public ourVacancies = false;

  constructor(private formBuilder: FormBuilder, private afs: Firestore) {}

  ngOnInit(): void {
    this.initForm();
    const windowWidth = window.innerWidth;
    if (windowWidth <= 524) {
      this.ourVacancies = true;
    } else {
      this.ourVacancies = false;
    }
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
    const vacancy = {
      firstname: this.customerForm.value.firstname,
      phone: this.customerForm.value.phone,
      email: this.customerForm.value.email,
      comment: this.customerForm.value.comment,
      selectedFile: this.selectedFile || null,
    };
    const vacancyCollectionRef = collection(this.afs, 'vacancy');
    console.log(vacancyCollectionRef);

    try {
      const docRef = await addDoc(vacancyCollectionRef, vacancy);
      console.log('Документ успешно добавлен с ID:', docRef.id);
    } catch (error) {
      console.error('Ошибка при добавлении документа:', error);
    }
  }

  vacanciesConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    fade: true,
    autoplay: false,
    dots: true,
    arrows: true,
    swipe: true,
  };
}
