import { Component } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdditionalProductsComponent } from 'src/app/modals-win/additional-products/additional-products.component';
import { AdditionalProductsResponse } from 'src/app/shared/interfaces/additional-products';
import { APCategoryResponse } from 'src/app/shared/interfaces/additionalProductsCategory';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { AdditionalProductsService } from 'src/app/shared/services/additional-products/additional-products.service';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css'],
})
export class ProductInfoComponent {
  public uid = '';
  public productId = '';
  public productName = '';
  public favoriteProducts: string[] = [];
  public productData: any = [];
  public addProdId: any = [];
  public additionalProducts: any = [];
  public activeAddProducts: number[] = [];
  public addProdActiveArr: any = [];
  public addProductPrice = 0;
  public productPrice = 0;
  public productCount = 0;
  public bonus = 0;
  public totalPrice = 0;
  public user = '';
  public goodsArr: Array<GoodsResponse> = [];
  public menuGoodsArr: Array<GoodsResponse> = [];
  public activeSection = 'drinks';
  public noCategory = true;
  public ingGroupOn = false;

  constructor(
    private categoriesService: CategoriesService,
    private goodsService: GoodsService,
    private route: ActivatedRoute,
    private afs: Firestore,
    private favoritesService: FavoritesService,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private addProdService: AdditionalProductsService,
    public dialog: MatDialog,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    if (customer) {
      this.uid = customer.uid;
      this.user = customer.role;

    }
    const productIdParam = this.route.snapshot.paramMap.get('id');
    this.productName = '';
    if (productIdParam !== null) {
      this.productId = productIdParam;
      this.favoritesService
        .getOneFavoriteProduct(this.uid, this.productId)
        .subscribe((favoriteProduct) => {
          if (favoriteProduct !== null) {
            this.favoriteProducts.push(this.productId);
          }
        });
    }

    this.getProduct();
  }

  //завантаження основного товару
  async getProduct() {
    try {
      this.productData = await firstValueFrom(
        this.goodsService.getOneGoods(this.productId as string)
      );
      this.productName = this.productData.menu.menuLink;
      this.productPrice = this.productData.price;
      this.addProdId = this.productData!.selectAddProduct;

      if (this.productName === 'desserts' || this.productName === 'drinks') {
        this.noCategory = false;
      }
      if (
        this.productName === 'pizza' &&
        Array.isArray(this.addProdId) &&
        this.addProdId.length > 0
      ) {
        this.ingGroupOn = true;
        this.getadditionalProducts();
        this.getRecommendedProducts();
      } else {
        this.ingGroupOn = false;
      }
      this.calcTotalPrice();
      this.getMenuProducts();
    } catch (error) { }
  }

  //Завантаження додаткового товару
  getadditionalProducts(): void {
    this.addProdService.getAll().subscribe((data) => {
      const additionalProducts = data as AdditionalProductsResponse[];
      for (const product of this.addProdId) {
        const existingProduct = additionalProducts.find(
          (item: any) => item.id === product
        );
        this.additionalProducts.push(existingProduct);
      }
    });
  }

  getRecommendedProducts() {
    this.goodsService.getAll().subscribe((data) => {
      this.goodsArr = data.filter(
        (item) => item.menu.menuLink === this.activeSection
      );
    });
  }
  getMenuProducts() {
    this.goodsService.getAll().subscribe((data) => {
      this.menuGoodsArr = data.filter(
        (item) => item.menu.menuLink === this.productName
      );
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

  //Кількість товару
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
        for (let i = 0; i < this.additionalProducts.length; i++) {
          if (i === index) {
            this.additionalProducts[i].apCount += 1;
            console.log(this.additionalProducts[i]);
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

  // Зміна кількості товару в кошику
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
    this.calcTotalPrice();

  }
  //

  //Загальна сума додаткового товару
  summAddProdActive() {
    let q = 0;
    for (let i = 0; i < this.addProdActiveArr.length; i++) {
      q += this.addProdActiveArr[i].summPrice;
    }

    this.addProductPrice = q;
    this.calcTotalPrice();
  }

  //Підрахунок загальної суми замовлення
  calcTotalPrice() {
    this.totalPrice = this.addProductPrice + this.productPrice;
    this.bonus = Math.round(this.totalPrice * 0.03);
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
    this.calcTotalPrice();
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

  //Улблені
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

  // Відкриття модального вікна для додавання або редагування адреси
  ingredient(productID: number | string): void {
    console.log(productID);

    const dialogRef = this.dialog.open(AdditionalProductsComponent, {
      panelClass: 'ing_madoal_dialog',
      data: { productID },
    });
  }

  drinkConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    centerMode: false,
    variableWidth: true,
    autoplay: false,
    dots: true,
    arrows: true,
    swipe: true,
  };

  productInfo(poduct: any): void {
    this.productId = poduct.id;
    this.productName = poduct.menu.menuLink;
    this.addProdId = [];
    this.getProduct();
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
