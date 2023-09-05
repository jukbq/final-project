import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss'],
})
export class DrinksComponent {
  constructor(
    private goodsService: GoodsService,
    private headerService: HeaderService,
    private toastr: ToastrService
  ) {}

  public activeSection = 'drinks';
  public goodsArr: Array<GoodsResponse> = [];
  public activeItem: any;
  public user = '';

  ngOnInit(): void {
    // Отримати список товарів
    this.getGoods();

    const pageInfo = {
      title: this.activeSection,
    };
    this.headerService.emitPageInfo(pageInfo);
  }

  //ТОВАРИ
  // Отримати список товарів
  getGoods(): void {
    this.goodsService.getAll().subscribe((data) => {
      this.goodsArr = data.filter(
        (item) => item.menu.menuLink === this.activeSection
      );
    });
  }

  //КОШИК
  // Зміна кількості товарів в кошику
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
  addToBasket(goods: GoodsResponse): void {
    let basket: Array<GoodsResponse> = [];
    if (this.user === 'ADMIN') {
      this.toastr.warning(
        'Адміністратор не може робити замовлення, увійдіть або зареєструйтесь '
      );
    } else {
      if (localStorage.length > 0 && localStorage.getItem('basket')) {
        basket = JSON.parse(localStorage.getItem('basket') as string);

        if (basket.some((good) => good.id === goods.id)) {
          const index = basket.findIndex((good) => good.id === goods.id);
          basket[index].count += goods.count;
        } else {
          basket.push(goods);
        }
      } else {
        basket.push(goods);
      }

      localStorage.setItem('basket', JSON.stringify(basket));
      goods.count = 1;
    }
  }
}
