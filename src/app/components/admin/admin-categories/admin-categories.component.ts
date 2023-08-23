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
import { MenuResponse } from 'src/app/shared/interfaces/menu';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

const LIST: any[] = [
  { name: 'МЕНЮ', link: 'menu' },
  { name: 'ОСНОВНІ ТОВАРИ', link: 'basic' },
  { name: 'ДОДАТКОВІ ТОВАРИ', link: 'additional' },
];

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'],
})
export class AdminCategoriesComponent {
  constructor(
    private menuService: MenuService,
    private categoriesService: CategoriesService,
    private apCategoriesService: ApCategoryService,
    private formBuild: FormBuilder,
    private storsgeIcon: Storage
  ) {}

  // Масив для відображення меню
  public list: any[] = LIST;

  // Масиви для збереження даних з сервера
  public menu: Array<MenuResponse> = [];
  public category: Array<СategoriesResponse> = [];
  public apCategory: Array<APCategoryResponse> = [];

  // Форми для роботи з даними
  public menuForm!: FormGroup;
  public categoryForn!: FormGroup;
  public apCategoryForn!: FormGroup;

  // Змінні для відстеження активної форми
  public active_form_1 = false;
  public active_form_2 = false;
  public active_form_3 = false;

  // Змінні для відстеження статусу редагування
  public edit_status = false;
  public ap_edit_status = false;
  public menu_edit_status = false;

  // Змінна для відстеження відсотка завантаження
  public uploadPercent!: number;

  // Змінна для збереження ідентифікатора категорії
  private categoryID!: number | string;

  // Змінна для відстеження активного пункту меню
  public activeItem: any;

  // Змінна для відстеження активної секції
  public activeSection = 'menu';

  ngOnInit(): void {
    this.initMenuForm();
    this.initCategoryForm();
    this.initAPCategoryForm();
    this.getCategory();
  }

  // Обробник вибору пункту меню
  onSelectItem(item: string): void {
    this.activeSection = item;
  }

  // Ініціалізація форми для меню
  initMenuForm(): void {
    this.menuForm = this.formBuild.group({
      menuindex: [null, Validators.required],
      menuName: [null, Validators.required],
      menuLink: [null, Validators.required],
      menuImages: [null, Validators.required],
    });
  }

  // Ініціалізація форми для категорій
  initCategoryForm(): void {
    this.categoryForn = this.formBuild.group({
      titel: [null, Validators.required],
      link: [null, Validators.required],
      images: [null, Validators.required],
    });
  }

  // Ініціалізація форми для додаткових категорій
  initAPCategoryForm(): void {
    this.apCategoryForn = this.formBuild.group({
      category: [null, Validators.required],
      link: [null, Validators.required],
    });
  }

  // Отримання даних з сервера
  getCategory(): void {
    this.categoriesService.getAll().subscribe((data) => {
      this.category = data as СategoriesResponse[];
    });

    this.apCategoriesService.getAll().subscribe((data) => {
      this.apCategory = data as APCategoryResponse[];
    });

    this.menuService.getAll().subscribe((data) => {
      this.menu = data as MenuResponse[];
      console.log(this.menu);
    });
  }

  // Додавання або редагування меню
  creatMenu() {
    if (this.menu_edit_status) {
      this.menuService
        .editMenu(this.menuForm.value, this.categoryID as string)
        .then(() => {
          this.getCategory();
        });
    } else {
      this.menuService.addMenu(this.menuForm.value).then(() => {
        this.getCategory();
      });
    }
    this.menu_edit_status = false;
    this.active_form_3 = false;
    this.menuForm.reset();
  }

  // Додавання або редагування категорії
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

  // Додавання або редагування додаткової категорії
  appCreatCategory() {
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

  // Редагування меню
  editMenu(menu: MenuResponse) {
    this.menuForm.patchValue({
      menuindex: menu.menuindex,
      menuName: menu.menuName,
      menuLink: menu.menuLink,
      menuImages: menu.menuImages,
    });
    this.active_form_3 = true;
    this.menu_edit_status = true;
    this.categoryID = menu.id;
  }

  // Редагування категорії
  editCategory(categ: СategoriesResponse) {
    this.categoryForn.patchValue({
      menu: categ.menu,
      titel: categ.titel,
      link: categ.link,
      images: categ.images,
    });
    this.active_form_1 = true;
    this.edit_status = true;
    this.categoryID = categ.id;
  }

  // Редагування додаткової категорії
  apEditCategory(categ: APCategoryResponse) {
    this.apCategoryForn.patchValue({
      category: categ.category,
      link: categ.link,
    });
    this.active_form_2 = true;
    this.ap_edit_status = true;
    this.categoryID = categ.id;
  }

  // Завантаження зображення для меню
  uploadMenuImage(actionImage: any): void {
    const file = actionImage.target.files[0];
    this.loadFIle('icon', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.menuForm.patchValue({
            menuImages: data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Завантаження зображення для категорії
  uploadCategoryImage(actionImage: any): void {
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

  // Завантаження файлу в хмарне сховище
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
      console.log('Wrong file');
    }
    return Promise.resolve(urlIcom);
  }

  // Видалення пункту меню
  delMenu(index: MenuResponse) {
    const task = ref(this.storsgeIcon, index.menuImages);
    deleteObject(task);
    this.menuService.delMenu(index.id as string).then(() => {
      this.getCategory();
    });
  }

  // Видалення категорії
  delCategory(index: СategoriesResponse) {
    const task = ref(this.storsgeIcon, index.images);
    deleteObject(task);
    this.categoriesService.delCategory(index.id as string).then(() => {
      this.getCategory();
    });
  }

  // Видалення додаткової категорії
  apDelCategory(index: APCategoryResponse) {
    this.apCategoriesService.delCategory(index.id as string).then(() => {
      this.getCategory();
    });
  }

  // Видалення зображення
  deleteImage(): void {
    const task1 = ref(this.storsgeIcon, this.valueByControlMenu('menuImages'));
    const task2 = ref(this.storsgeIcon, this.valueByControlCategory('images'));
    console.log(task1);
    console.log(task2);
    
    deleteObject(task1 && task2).then(() => {
      console.log('File deleted');
      this.uploadPercent = 0;
      this.categoryForn.patchValue({
        images: '',
      });
    });
  }

  // Отримання значення за назвою поля у формі меню
  valueByControlMenu(control: string): string {
    return this.menuForm.get(control)?.value;
  }

  // Отримання значення за назвою поля у формі категорії
  valueByControlCategory(control: string): string {
    return this.categoryForn.get(control)?.value;
  }
}
