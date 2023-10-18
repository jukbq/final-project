import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdditionalProductsResponse } from 'src/app/shared/interfaces/additional-products';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { AdditionalProductsService } from 'src/app/shared/services/additional-products/additional-products.service';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-additional-products',
  templateUrl: './additional-products.component.html',
  styleUrls: ['./additional-products.component.css'],
})
export class AdditionalProductsComponent {
  public productID: any;
  public favoriteProducts: string[] = [];
  public productData: any = [];
  public uid = '';
  public user = '';
  public productPrices = 0;
  public additionalProducts: Array<AdditionalProductsResponse> = [];
  public addProductsSort: any = [];
  public activeAddProducts: number[] = [];
  public addProdActiveArr: any = [];
  public addProductPrice = 0;
  public noCategory = true;
  public bonus = 0;

  constructor(
    private goodsService: GoodsService,
    private favoritesService: FavoritesService,
    private addProdService: AdditionalProductsService,
    public dialogRef: MatDialogRef<AdditionalProductsComponent>,
    private headerService: HeaderService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA)
    public data: { productID: any }
  ) {}

  ngOnInit(): void {
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    this.uid = customer.uid;
    this.user = customer.role;
    this.productID = this.data.productID;
    console.log(this.productID);

    this.getProduct();
    this.getadditionalProducts();
  }

  getProduct() {
    console.log(this.productID);
    this.goodsService.getOneGoods(this.productID).subscribe((data) => {
      this.productData = data;
      let productMenuName = this.productData.menu.menuLink;
      if (productMenuName === 'desserts' || productMenuName === 'drinks') {
        this.noCategory = false;
      }
    });

    console.log(this.productData);
  }

  //Завантаження додаткового товару
  getadditionalProducts(): void {
    this.addProdService.getAll().subscribe((data) => {
      this.additionalProducts = data;
      for (let i = 0; i < this.additionalProducts.length; i++) {
        if (this.additionalProducts[i].category.link === 'sauce') {
          this.addProductsSort.push(this.additionalProducts[i]);
        }
      }
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

  // Зміна кількості додаткового товару в кошику
  quantity_ings(index: any, value: boolean) {
    const isActive = this.isActive(index);
    if (isActive) {
      if (value) {
        this.addProdActiveArr = this.addProdActiveArr.map(
          (item: {
            id: any;
            apCount: number;
            apPrice: number;
            summPrice: number;
          }) => {
            if (item.id === index) {
              item.apCount += 1;
              item.summPrice = item.apPrice * item.apCount;
            }
            return item;
          }
        );
        for (let i = 0; i < this.addProductsSort.length; i++) {
          if (i === index) {
            this.addProductsSort[i].apCount += 1;
            console.log(this.addProductsSort[i]);
          }
        }
      } else {
        this.addProdActiveArr = this.addProdActiveArr.map(
          (item: {
            id: any;
            apCount: number;
            apPrice: number;
            summPrice: number;
          }) => {
            if (item.id === index) {
              if (item.apCount > 1) {
                item.apCount -= 1;
                item.summPrice -= item.apPrice;
              }
            }
            return item;
          }
        );
        for (let i = 0; i < this.additionalProducts.length; i++) {
          if (i === index) {
            if (this.additionalProducts[i].apCount > 1) {
              this.additionalProducts[i].apCount -= 1;
            }
          }
        }
      }
    }
    this.summAddProdActive();
  }

  selectIngBtn(category: string, event: Event) {
    const elements = document.querySelectorAll('.sauce, .appendices');
    elements.forEach((element) => {
      element.classList.remove('active');
    });

    // Додати активний клас до поточного елемента
    const element = event.currentTarget as HTMLElement;
    element.classList.add('active');
    if (category === 'sauce') {
      this.addProductsSort = [];
      for (let i = 0; i < this.additionalProducts.length; i++) {
        if (this.additionalProducts[i].category.link === 'sauce') {
          this.addProductsSort.push(this.additionalProducts[i]);
        }
      }
    } else {
      this.addProductsSort = [];
      for (let i = 0; i < this.additionalProducts.length; i++) {
        this.addProductsSort.push(this.additionalProducts[i]);
      }
    }
  }

  quantity_goods(good: GoodsResponse, value: boolean): void {
    if (value) {
      ++good.count;
      good.newPrice = true;
      good.priceTogether = good.price * good.count;
      good.bonusTogether = good.bonus * good.count;
    } else if (!value && good.count > 1) {
      --good.count;
      good.priceTogether -= good.price;
      good.bonusTogether -= good.bonus;
    }
  }
  // Додавання товару до кошика
  addToBasket(goods: any): void {
    if (this.user === 'ADMIN') {
      this.toastr.warning(
        'Адміністратор не може робити замовлення, увійдіть або зареєструйтесь'
      );
      return;
    }
    let order = {
      bonus: this.bonus,
      bonusTogether: goods.bonusTogether,
      category: goods.category,
      compound: goods.compound,
      count: goods.count,
      id: goods.id,
      images: goods.images,
      menu: goods.menu,
      name: goods.name,
      newPrice: goods.newPrice,
      price: goods.price,
      priceTogether: goods.priceTogether,
      weight: goods.weight,
      addProducts: this.addProdActiveArr,
    };
    let basket: any = [];
    let addProd = this.addProdActiveArr;
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      console.log('первірка чи кощик не пустий');

      console.log('первірка чи є товар');
      if (basket.some((good: { id: any }) => good.id === goods.id)) {
        const index = basket.findIndex(
          (good: { id: any }) => good.id === goods.id
        );
        console.log('Збільшення кількості товару');
        basket[index].count += goods.count;
        basket[index].priceTogether = goods.price * basket[index].count;

        if (addProd.length > 0) {
          for (const element of addProd) {
            const existingProduct = basket[index].addProducts.find(
              (item: any) => item.id === element.id
            );
            if (existingProduct) {
              console.log('Знайдено товар', existingProduct);
              existingProduct.apCount += 1;
              existingProduct.summPrice =
                existingProduct.apPrice * existingProduct.apCount;
            } else {
              element.apCount = 1;
              element.summPrice = element.apPrice;
              basket[index].addProducts.push(element);
            }
          }
        }
      } else {
        basket.push(order);
      }
    } else {
      basket.push(order);
    }

    goods.priceTogether = goods.price;
    localStorage.setItem('basket', JSON.stringify(basket));
    this.headerService.updateBasketData(basket);
    this.cleanAll();
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
