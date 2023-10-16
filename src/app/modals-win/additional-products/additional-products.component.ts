import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdditionalProductsResponse } from 'src/app/shared/interfaces/additional-products';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { AdditionalProductsService } from 'src/app/shared/services/additional-products/additional-products.service';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';

@Component({
  selector: 'app-additional-products',
  templateUrl: './additional-products.component.html',
  styleUrls: ['./additional-products.component.css'],
})
export class AdditionalProductsComponent {
  public productID: any;
  public favoriteProducts: string[] = [];
  public uid = '';
  public productImages = '';
  public productPrices = 0;
  public productWeightes = '';
  public productCompound = '';
  public productName = '';
  public productCatImg = '';
  public additionalProducts: Array<AdditionalProductsResponse> = [];
  public activeAddProducts: number[] = [];
  public addProdActiveArr: any = [];
  public addProductPrice = 0;

  constructor(
    private goodsService: GoodsService,
    private favoritesService: FavoritesService,
    private addProdService: AdditionalProductsService,
    public dialogRef: MatDialogRef<AdditionalProductsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { productID: any }
  ) {}

  ngOnInit(): void {
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    this.uid = customer.uid;
    this.productID = this.data.productID;
    this.getProduct();
    this.getadditionalProducts();
  }

  getProduct() {
    this.goodsService
      .getOneGoods(this.productID as string)
      .subscribe((data) => {
        const productData = data as GoodsResponse;
        this.productImages = productData.images;
        this.productPrices = productData.price;
        this.productWeightes = productData.weight;
        this.productWeightes = productData.weight;
        this.productName = productData.name;
        this.productCompound = productData.compound;
        this.productCatImg = productData.category.images;
      });
  }

  //Завантаження додаткового товару
  getadditionalProducts(): void {
    this.addProdService.getAll().subscribe((data) => {
      this.additionalProducts = data as AdditionalProductsResponse[];
    });
  }

  //Додавання додаткового товару в масив
  toggleActive(index: number) {
    const isActive = this.isActive(index);
    if (!isActive) {
      this.activeAddProducts.push(index);
      const ing = this.additionalProducts[index];
      const q = {
        id: index,
        apcategory: ing.category,
        apName: ing.apName,
        apCount: ing.apCount,
        apPrice: ing.apPrice,
        summPrice: ing.apPrice,
        apImages: ing.apImages,
      };
      this.addProdActiveArr.push(q);
      this.summAddProdActive();
    } else {
      this.activeAddProducts = this.activeAddProducts.filter(
        (i) => i !== index
      );
      for (let i = 0; i < this.addProdActiveArr.length; i++) {
        if (this.addProdActiveArr[i].id === index) {
          this.addProdActiveArr.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.additionalProducts.length; i++) {
        if (i === index) {
          this.additionalProducts[i].apCount = 1;
        }
      }
      this.summAddProdActive();
    }
    this.clearAllActive();
  }

  //Активація та деактивація картки додаткового товару
  isActive(index: number): boolean {
    return this.activeAddProducts.includes(index);
  }

  //Загальна сума додаткового товару
  summAddProdActive() {
    let q = 0;
    for (let i = 0; i < this.addProdActiveArr.length; i++) {
      q += this.addProdActiveArr[i].summPrice;
    }

    this.addProductPrice = q;
  }
  //Очитска замовлень
  cleanAll() {
    this.activeAddProducts = [];
    this.addProdActiveArr = [];
    this.addProductPrice = 0;
    for (let i = 0; i < this.additionalProducts.length; i++) {
      this.additionalProducts[i].apCount = 1;
    }
    this.clearAllActive();
    this.getProduct();
  }
  clearAllActive() {
    const cleanAll = document.querySelector('.ing_output-clean-all');
    if (cleanAll) {
      if (this.activeAddProducts.length > 0) {
        cleanAll.classList.add('active');
      } else {
        cleanAll.classList.remove('active');
      }
    }
  }

  // Перевірка, чи є товар у списку улюблених користувача
  isFavorite(product: any): boolean {
    return this.favoriteProducts.includes(product);
  }

  //додати в обране
  addFavorites(poduct: any): void {
    const productId = poduct;
    if (this.isFavorite(poduct)) {
      this.favoritesService
        .removeFromFavorites(this.uid, productId)
        .then(() => {
          this.favoriteProducts = this.favoriteProducts.filter(
            (favProductId) => favProductId !== productId
          );
        });
    } else {
      this.favoritesService.addToFavorites(this.uid, productId).then(() => {
        this.favoriteProducts.push(productId);
      });
    }
  }

  selectIngBtn(category: string, event: Event) {
   const elements = document.querySelectorAll('.sauces, .appendices');
   elements.forEach((element) => {
     element.classList.remove('active');
   });

   // Додати активний клас до поточного елемента
   const element = event.currentTarget as HTMLElement;
   element.classList.add('active');
  }
}
