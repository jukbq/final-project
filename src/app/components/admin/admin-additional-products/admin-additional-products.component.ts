import { Component } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  NumberValueAccessor,
  Validators,
} from '@angular/forms';
import { AdditionalProductsResponse } from 'src/app/shared/interfaces/additional-products';
import { APCategoryResponse } from 'src/app/shared/interfaces/additionalProductsCategory';
import { AdditionalProductsService } from 'src/app/shared/services/additional-products/additional-products.service';
import { ApCategoryService } from 'src/app/shared/services/apCategory/ap-category.service';

@Component({
  selector: 'app-admin-additional-products',
  templateUrl: './admin-additional-products.component.html',
  styleUrls: ['./admin-additional-products.component.scss'],
})
export class AdminAdditionalProductsComponent {
  constructor(
    private formBuilder: FormBuilder,
    private addProdService: AdditionalProductsService,
    private addProdCategory: ApCategoryService, 
    private storsge: Storage
  ) {}
  public category: Array<APCategoryResponse> = [];
  public addProd: Array<AdditionalProductsResponse> = [];
  public ap_form = false;
  public addCategory = false;
  private addProdID!: number | string;
  public addProdForm!: FormGroup;
  public edit_status = false;
  public uploadPercent!: number;
  public link = '';

  ngOnInit(): void {
    this.initGoodForm();
    this.getAddProd();
  }

  initGoodForm(): void {
    this.addProdForm = this.formBuilder.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      images: [null, Validators.required],
      count: [1],
    });
  }

  getAddProd(): void {
    this.addProdService.getAll().subscribe((data) => {
      this.addProd = data as AdditionalProductsResponse[];
    });
    this.addProdCategory.getAll().subscribe((data) => {
      this.category = data as APCategoryResponse[];
        });
  }

  creatAddProd() {
    if (this.edit_status) {
      this.addProdService
        .editAdditionalProductss(
          this.addProdForm.value,
          this.addProdID as string
        )
        .then(() => {
          this.getAddProd();
          this.uploadPercent = 0;
        });
    } else {
      this.addProdService
        .addAdditionalProducts(this.addProdForm.value)
        .then(() => {
          this.getAddProd();
          this.uploadPercent = 0;
        });
    }

    this.edit_status = false;
    this.ap_form = false;
    this.addProdForm.reset();
  }

  editAddProd(addProd: AdditionalProductsResponse) {
    this.addProdForm.patchValue({
      category: addProd.category,
      name: addProd.name,
      weight: addProd.weight,
      price: addProd.price,
      images: addProd.images,
    });
    this.ap_form = true;
    this.edit_status = true;
    this.addProdID = addProd.id;
  }

  delAddPro(index: AdditionalProductsResponse) {
    const task = ref(this.storsge, index.images);
    deleteObject(task);
    this.addProdService.delAdditionalProductss(index.id as string).then(() => {
      this.getAddProd();
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.loadFIle('images', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.addProdForm.patchValue({
            images: data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async loadFIle(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storsge, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wtong fike');
    }
    return Promise.resolve(url);
  }

  deleteImage(): void {
    const task = ref(this.storsge, this.valueByControl('images'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.addProdForm.patchValue({
        images: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.addProdForm.get(control)?.value;
  }
}
