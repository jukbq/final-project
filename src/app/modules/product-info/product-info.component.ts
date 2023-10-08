import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css'],
})
export class ProductInfoComponent {
  public uid = '';
  public productId = '';
  public favoriteProducts: string[] = [];
  public productData: GoodsResponse | undefined;

  constructor(
    private categoriesService: CategoriesService,
    private goodsService: GoodsService,
    private route: ActivatedRoute,
    private afs: Firestore,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    this.uid = customer.uid;
    const productIdParam = this.route.snapshot.paramMap.get('id');

    if (productIdParam !== null) {
      this.productId = productIdParam;
      this.getProduct();

      this.favoritesService
        .getOneFavoriteProduct(this.uid, this.productId)
        .subscribe((favoriteProduct) => {
          if (favoriteProduct !== null) {
            // Якщо продукт є у списку улюблених, додайте його до favoriteProducts
            this.favoriteProducts.push(this.productId);
          }
        });
    }
  }

  getProduct() {
    this.goodsService
      .getOneGoods(this.productId as string)
      .subscribe((data) => {
        this.productData = data as GoodsResponse;
      });
  }

  // Перевірка, чи є товар у списку улюблених користувача
  isFavorite(product: any): boolean {
    return this.favoriteProducts.includes(product);
  }

  //додати в обране
  addFavorites(poduct: any): void {
    const productId = poduct;
    console.log(productId);
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
}
