import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { СategoriesResponse } from 'src/app/shared/interfaces/categories';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { APCategoryResponse } from 'src/app/shared/interfaces/additionalProductsCategory';
import { AdditionalProductsService } from 'src/app/shared/services/additional-products/additional-products.service';
import { ApCategoryService } from 'src/app/shared/services/apCategory/ap-category.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent {
  constructor(
    private categoriesService: CategoriesService,
    private apCategoriesService: ApCategoryService,
    private formBuild: FormBuilder,
    private storsgeIcon: Storage
  ) {}

  public category: Array<СategoriesResponse> = [];
  public apCategory: Array<APCategoryResponse> = [];
  public categoryForn!: FormGroup;
  public apCategoryForn!: FormGroup;
  public active_form_1 = false;
  public active_form_2 = false;
  public edit_status = false;
  public ap_edit_status = false;
  public uploadPercent!: number;
  private categoryID!: number | string;

  ngOnInit(): void {
    this.initCategoryForm();
    this.initAPCategoryForm();
    this.getCategory();
  }

  initCategoryForm(): void {
    this.categoryForn = this.formBuild.group({
      titel: [null, Validators.required],
      link: [null, Validators.required],
      images: [null, Validators.required],
    });
  }
  initAPCategoryForm(): void {
    this.apCategoryForn = this.formBuild.group({
      category: [null, Validators.required],
      link: [null, Validators.required],
    });
  }

  getCategory(): void {
    this.categoriesService.getAll().subscribe((data) => {
      this.category = data as СategoriesResponse[];
    });
    this.apCategoriesService.getAll().subscribe((data) => {
      this.apCategory = data as APCategoryResponse[];
    });
  }

  creatCategory() {
    if (this.edit_status) {
      this.categoriesService
        .editCategory(this.categoryForn.value, this.categoryID as string)
        .then(() => {
          this.getCategory();
        });
    } else {
      this.categoriesService.addCategory(this.categoryForn.value).then(() => {
        this.getCategory();
      });
    }
    this.edit_status = false;
    this.active_form_1 = false;
    this.categoryForn.reset();
  }
  appCreatCategory(){
    if (this.ap_edit_status) {
      this.apCategoriesService
        .editCategory(this.apCategoryForn.value, this.categoryID as string)
        .then(() => {
          this.getCategory();
        });
    } else {
      this.apCategoriesService
        .addCategory(this.apCategoryForn.value)
        .then(() => {
          this.getCategory();
        });
    }

    this.ap_edit_status = false;
    this.active_form_2 = false;
    this.apCategoryForn.reset();
  }

  editCategory(categ: СategoriesResponse) {
    this.categoryForn.patchValue({
      titel: categ.titel,
      link: categ.link,
      images: categ.images,
    });
    this.active_form_1 = true;
    this.edit_status = true;
    this.categoryID = categ.id;
  }
  apEditCategory(categ: APCategoryResponse) {
    this.apCategoryForn.patchValue({
      category: categ.category,
      link: categ.link,
    });
    this.active_form_2 = true;
    this.ap_edit_status = true;
    this.categoryID = categ.id;
  }

  upload(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.categoryForn.patchValue({
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
    const pathIcon = `${folder}/${name}`;
    let urlIcom = '';
    if (file) {
      try {
        const storageRef = ref(this.storsgeIcon, pathIcon);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        urlIcom = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wtong fike');
    }
    return Promise.resolve(urlIcom);
  }

  delCategory(index: СategoriesResponse) {
    const task = ref(this.storsgeIcon, index.images);
    deleteObject(task);
    this.categoriesService.delCategory(index.id as string).then(() => {
      this.getCategory();
    });
  }
  apDelCategory(index: APCategoryResponse) {
 
    this.apCategoriesService.delCategory(index.id as string).then(() => {
      this.getCategory();
    });
  }

  deleteImage(): void {
    const task = ref(this.storsgeIcon, this.valueByControl('images'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.categoryForn.patchValue({
        images: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.categoryForn.get(control)?.value;
  }
}
