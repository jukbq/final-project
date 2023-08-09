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
import { СategoriesResponse } from 'src/app/shared/interfaces/categories';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';

@Component({
  selector: 'app-admin-goods',
  templateUrl: './admin-goods.component.html',
  styleUrls: ['./admin-goods.component.scss'],
})
export class AdminGoodsComponent {
  constructor(
    private formBuilder: FormBuilder,
    private goodsService: GoodsService,
    private categoriesService: CategoriesService,
    private storsge: Storage
  ) {}
  public menu: Array<any> = [
    { menuName: 'Піца', link: 'pizza' },
    { menuName: 'Салати', link: 'salads' },
    { menuName: 'Десерти', link: 'desserts' },
    { menuName: 'Напої', link: 'drinks' },
  ];

  public category: Array<СategoriesResponse> = [];
  public goods: Array<GoodsResponse> = [];
  public addProd: Array<AdditionalProductsResponse> = [];
  public good_form = false;
  private goodID!: number | string;
  public goodForm!: FormGroup;
  public edit_status = false;
  public uploadPercent!: number;
  public link = '';

  ngOnInit(): void {
    this.getCategory();
    this.initGoodForm();
    this.getGoods();
  }

  initGoodForm(): void {
    this.goodForm = this.formBuilder.group({
      menu: [null],
      category: [null, Validators.required],
      name: [null, Validators.required],
      compound: [null, Validators.required],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      images: [null, Validators.required],
      count: [1],
    });
  }

  getCategory(): void {
    this.categoriesService.getAll().subscribe((data) => {
      this.category = data as СategoriesResponse[];
      console.log(this.category);
    });
  }

  getGoods(): void {
    this.goodsService.getAll().subscribe((data) => {
      this.goods = data as GoodsResponse[];
      console.log(this.goods);
    });
  }

  creatGoods() {
    if (this.edit_status) {
      this.goodsService
        .editGoods(this.goodForm.value, this.goodID as string)
        .then(() => {
          this.getGoods();
          this.uploadPercent = 0;
        });
    } else {
      this.goodsService.addGoods(this.goodForm.value).then(() => {
        this.getGoods();
        this.uploadPercent = 0;
      });
    }

    this.edit_status = false;
    this.good_form = false;
    this.goodForm.reset();
  }

  editGood(good: GoodsResponse) {
    this.goodForm.patchValue({
      category: good.category,
      name: good.name,
      compound: good.compound,
      weight: good.weight,
      price: good.price,
      images: good.images,
    });
    this.good_form = true;
    this.edit_status = true;
    this.goodID = good.id;
  }

  delGood(index: GoodsResponse) {
    const task = ref(this.storsge, index.images);
    deleteObject(task);
    this.goodsService.delGoods(index.id as string).then(() => {
      this.getGoods();
    });
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.loadFIle('images', file.name, file)
      .then((data) => {
        if (this.uploadPercent == 100) {
          this.goodForm.patchValue({
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
      this.goodForm.patchValue({
        images: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.goodForm.get(control)?.value;
  }

  onFilterChange() {}
}
