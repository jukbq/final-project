import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { addDoc, collection, doc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  public customerForm!: FormGroup;
  public bsConfig: Partial<BsDatepickerConfig>;
  public basket: Array<GoodsResponse> = [];
  public customer: any;
  public userAddress: any = [];
  public addressArr: any = [];
  public timeOptions: string[] = [];
  public uid = '';
  public firstName = '';
  public phone!: number;
  public email = '';
  public type = '';
  public city = '';
  public street = '';
  public houseNumber!: number;
  public entrance!: number;
  public floor!: number;
  public apartment!: number;
  public selectedDate = '';
  public selectedTime = '';
  public summ = 0;
  public count = 0;
  public bonus = 0;
  public inputValue = 0;
  public change = '';
  public userBonus = 0;
  public allbonus = 0;
  public bonusToUse = 0;
  public allApplyBonus = 0;
  public registeredUser = false;
  public deliveryMethod = false;
  public deliveryForTime = false;
  public paymentMethod = 'cash';
  public calculateChangetDisabled = false;
  public noChangeDisabled = false;
  public noBonuses = false;
  public animateBonus = false;
  public thereAreBonuses = false;
  public inputBonus = false;
  public applyBonus = false;
  public commentAreaOpen = false;
  public callCustomer = '';
  public comment = '';

  constructor(
    private el: ElementRef,
    private orderService: OrderService,
    private formBuilder: FormBuilder,
    private afs: Firestore,
    private router: Router
  ) {
    this.customerForm = this.formBuilder.group({
      deliveryDate: [new Date(), Validators.required],
      selectedTime: ['Доставити якомога швидше', Validators.required],
    });

    this.bsConfig = {
      minDate: new Date(),
      dateInputFormat: 'DD.MM.YYYY',
    };

    this.generateTimeOptions();
    setTimeout(() => {
      this.customerForm.get('deliveryTime')?.setValue('*Час доставки');
    });
  }

  ngOnInit(): void {
    const cartElement = this.el.nativeElement.querySelector('.basket');
    this.addToBasket();
    this.updateBasket();
    this.summPrice();
    this.initForm();
    this.getСustomerInfo();
    this.generateTimeOptions();

    this.customerForm.get('deliveryDate')?.valueChanges.subscribe(() => {
      this.generateTimeOptions();
    });

    this.orderService.chageBasket.subscribe(() => {
      this.addToBasket();
      this.summPrice();
    });
  }

  // Ініціалізація форми
  initForm(): void {
    this.customerForm = this.formBuilder.group({
      uid: [null],
      firstname: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      type: [null, Validators.required],
      city: [null, Validators.required],
      street: [null, Validators.required],
      houseNumber: [null, Validators.required],
      entrance: [null],
      floor: [null],
      apartment: [null],
      deliveryDate: [new Date()],
      deliveryTime: [null],
      change: [null],
    });
  }

  // Отримання інформації про користувача
  getСustomerInfo() {
    this.customer = JSON.parse(localStorage.getItem('curentUser') as string);
    if (this.customer !== null) {
      this.registeredUser = true;
      let userInfo = this.customer;
      this.addressArr = this.customer.address;
      this.uid = this.customer.uid;

      if (userInfo) {
        this.firstName = userInfo.firstName;
        this.phone = userInfo.phone;
        this.email = userInfo.email;
        this.userBonus = userInfo.userBonus;
        this.allbonus = userInfo.userBonus;
        this.customerForm.patchValue({
          firstname: this.firstName,
          phone: this.phone,
          email: this.email,
        });
      }
    }
  }

  // Додавання товарів до кошика
  addToBasket(): void {
    const basketData = localStorage.getItem('basket');
    if (basketData && basketData !== 'null') {
      this.basket = JSON.parse(basketData);
      this.summPrice();
    }
  }

  // Зміна кількості товарів у кошику
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
    this.updateLocalStorage();
  }

  // Розрахунок загальної суми та бонусів
  summPrice(): void {
    this.summ = this.basket.reduce(
      (totalSum: number, good: GoodsResponse) =>
        totalSum + good.count * good.price,
      0
    );
    this.count = this.basket.reduce(
      (totalCount: number, goods: GoodsResponse) => totalCount + goods.count,
      0
    );
    this.bonus = this.basket.reduce(
      (totalBonus: number, good: GoodsResponse) =>
        totalBonus + good.count * good.bonus,
      0
    );
  }

  // Оновлення кошика
  updateBasket(): void {
    this.orderService.chageBasket.subscribe(() => this.addToBasket());
  }

  // Видалення товару з кошика
  delOrder(order: any) {
    let index = this.basket.findIndex((item) => item.id === order.id);
    if (index !== -1) {
      this.basket.splice(index, 1);

      if (this.basket.length === 0) {
        localStorage.removeItem('basket');
      } else {
        this.updateLocalStorage();
      }

      this.orderService.chageBasket.next(true);
    }
  }

  // Оновлення даних у локальному сховищі
  updateLocalStorage(): void {
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.summPrice();
  }

  // Вибір методу доставки
  choiseDeliveryMethod(method: string) {
    if (method === 'local_pickup') {
      this.deliveryMethod = true;
      this.customerForm.patchValue({
        type: '',
        city: '',
        street: '',
        houseNumber: '',
        entrance: '',
        floor: '',
        apartment: '',
      });
    } else if (method === 'courier') {
      this.deliveryMethod = false;
      this.customerForm.patchValue({
        type: '',
        city: '',
        street: '',
        houseNumber: '',
      });
    }
  }

  // Вибір адреси доставки
  addressSelection(index: any) {
    const deliveryAddress = this.addressArr[index];
    this.type = deliveryAddress.type;
    this.city = deliveryAddress.city;
    this.street = deliveryAddress.street;
    this.houseNumber = deliveryAddress.houseNumber;
    this.entrance = deliveryAddress.entrance;
    this.floor = deliveryAddress.floor;
    this.apartment = deliveryAddress.apartment;
    this.customerForm.patchValue({
      type: this.type,
      city: this.city,
      street: this.street,
      houseNumber: this.houseNumber,
      entrance: this.entrance,
      floor: this.floor,
      apartment: this.apartment,
    });
  }

  // Вибір адреси самовивозу
  localPickupAddress(event: any) {
    const selectedValue = event.target.value;
    const [street, houseNumber] = selectedValue.split(' ');
    this.type = 'Самовиіз';
    this.city = 'Львів';
    this.street = street;
    this.houseNumber = houseNumber;
    this.customerForm.patchValue({
      type: this.type,
      city: this.city,
      street: this.street,
      houseNumber: this.houseNumber,
    });
  }

  // Вибір часу доставки
  timeWrapper(data: string) {
    if (data === 'as_time') {
      this.deliveryForTime = true;
    } else {
      this.deliveryForTime = false;
    }
  }

  // Генерація можливих годин доставки
  generateTimeOptions() {
    const selectedDate = this.customerForm.get('deliveryDate')?.value;
    const now = new Date();
    const startHour =
      selectedDate.toDateString() === now.toDateString()
        ? now.getHours() + 1
        : 0;
    const endHour = 23;
    this.timeOptions = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHourStart = hour.toString().padStart(2, '0');
        const formattedMinuteStart = minute.toString().padStart(2, '0');
        const formattedHourEnd = (hour + Math.floor(minute / 15))
          .toString()
          .padStart(2, '0');
        const formattedMinuteEnd = ((minute + 15) % 60)
          .toString()
          .padStart(2, '0');
        const timeOption = `${formattedHourStart}:${formattedMinuteStart} - ${formattedHourEnd}:${formattedMinuteEnd}`;
        this.timeOptions.push(timeOption);
      }
    }
  }

  // Вибір способу оплати
  choosingPaymentMethod(metod: string) {
    if (metod === 'cash') {
      this.paymentMethod = 'cash';
    } else if (metod === 'payment') {
      this.paymentMethod = 'Оплата онлайн';
    } else if (metod === 'terminal') {
      this.paymentMethod = 'Оплат через термінал';
    }
  }

  // Відображення або приховування блоку "Розрахувати решту"
  toggleInputChange(event: any) {
    const isChecked = event.target.checked;
    if (isChecked === true) {
      this.calculateChangetDisabled = true;
      this.change = 'Без решти';
    } else {
      this.calculateChangetDisabled = false;
      this.change = '';
    }
  }

  //Підрахунок решти
  calculateChanget(event: any) {
    this.inputValue = event.target.value;
    if (this.inputValue >= this.summ) {
      this.noChangeDisabled = true;
      let resalt = this.inputValue - this.summ;
      let resultString = resalt.toString();
      this.change = resultString;
    }
  }

  //Відкриття блоку застосування бонусів
  activebonus() {
    if (this.userBonus === 0) {
      this.noBonuses = true;
    } else {
      this.thereAreBonuses = true;
    }
  }

  //Застосування або відміна всіх бонусів користувача одразу
  useBonus(event: any) {
    const isChecked = event.target.checked;

    if (isChecked === true) {
      this.inputBonus = true;
      this.bonusToUse = this.userBonus;
      this.userBonus = 0;
      const bonusInputElement = this.el.nativeElement.querySelector(
        'input[name="bonus"]'
      );
      if (bonusInputElement) {
        bonusInputElement.value = this.bonusToUse.toString();
      }
    } else {
      this.inputBonus = false;
      this.userBonus = this.bonusToUse;
      this.bonusToUse = 0;
      const bonusInputElement = this.el.nativeElement.querySelector(
        'input[name="bonus"]'
      );
      if (bonusInputElement) {
        bonusInputElement.value = '0';
      }
    }
  }

//Внесеня кількості бонусів користувачем
  inputUserBonus(event: any) {
    const inputValue = event.target.value;

    if (inputValue < 0 || inputValue > this.allApplyBonus) {
      this.applyBonus = true;
    }

    if (inputValue == this.allbonus) {
      const chekBonus = document.querySelector(
        '.chekBonus'
      ) as HTMLInputElement;
      chekBonus.checked = true;
      this.inputBonus = true;
      this.applyBonus = false;
      this.userBonus = 0;
      this.bonusToUse = inputValue;
    }

    if (inputValue >= 0 && inputValue < this.userBonus) {
      const difference = inputValue - this.bonusToUse;

      if (difference >= 0) {
        this.userBonus -= difference;
        this.bonusToUse = inputValue;
        this.applyBonus = false;
      } else {
        this.userBonus += -difference;
        this.bonusToUse = inputValue;
        this.applyBonus = false;
      }
    }
  }

  //Застосування введеної кількості бонусів 
  applyBonusAction() {
    const bonusInput = document.querySelector(
      '.userBonusInput'
    ) as HTMLInputElement;
    const chekBonus = document.querySelector('.chekBonus') as HTMLInputElement;
    if (bonusInput) {
      const bonusInputValue = Number(bonusInput.value);
      this.allApplyBonus += bonusInputValue;
      this.summ -= this.allApplyBonus;
      this.bonusToUse = 0;
      bonusInput.value = '';
      chekBonus.checked = false;
      if (this.inputValue >= this.summ) {
        let resalt = this.inputValue - this.summ;
        let resultString = resalt.toString();
        this.change = resultString;
      }
    }
  }

  // Зателефонувати клієнту
  callMe(event: any) {
    const coll = event.target.checked;
    if (coll === true) {
      this.callCustomer = 'Клієнт очікує на дзвінок';
    } else {
      this.callCustomer = '';
    }
  }

  // Відкриття або закриття блоку для коментарів
  openComment(event: any) {
    this.commentAreaOpen = event.target.checked;
  }

  // Збереження коментарів
  onTextareaChange(event: any) {
    const textareaValue = (event.target as HTMLTextAreaElement).value;
    this.comment = textareaValue;
  }

  // Збереження замовлення
  async checkout() {
    // Перевіряємо, чи користувач є зареєстрованим
    if (this.uid === '') {
      console.log(this.uid);
      this.firstName = this.customerForm.get('firstname')?.value;
      this.phone = this.customerForm.get('phone')?.value;
      this.email = this.customerForm.get('email')?.value;
      this.type = this.customerForm.get('type')?.value;
      this.city = this.customerForm.get('city')?.value;
      this.street = this.customerForm.get('street')?.value;
      this.houseNumber = this.customerForm.get('houseNumber')?.value;
      this.entrance = this.customerForm.get('entrance')?.value;
      this.floor = this.customerForm.get('floor')?.value;
      this.apartment = this.customerForm.get('apartment')?.value;
    }

    // Визначаємо вибрану дату та час доставки
    if (this.deliveryForTime === false) {
      this.selectedDate = this.customerForm.get('deliveryDate')?.value;
      this.selectedTime = 'Доставити якомога швидше';
    } else {
      this.selectedDate = this.customerForm.get('deliveryDate')?.value;
      this.selectedTime = this.customerForm.get('deliveryTime')?.value;
    }

    // Переводимо метод оплати у зрозумілий формат
    if (this.paymentMethod === 'cash') {
      this.paymentMethod = 'Готівка';
    }

    // Оновлюємо дані користувача, якщо користувач є зареєстрованим
    if (this.uid !== '') {
      const userDocRef = doc(this.afs, 'users', this.uid);
      const dataToUpdate = {
        userBonus: this.userBonus,
      };
      try {
        await updateDoc(userDocRef, dataToUpdate);
        console.log('Документ оновлено успішно');
      } catch (error) {
        console.error('Помилка під час оновлення документа:', error);
      }
    }

    // Підготовлюємо об'єкт замовлення
    const order = {
      orderedItems: this.basket,
      uid: this.uid,
      firstName: this.firstName,
      phone: this.phone,
      email: this.email,
      type: this.type,
      city: this.city,
      street: this.street,
      houseNumber: this.houseNumber,
      entrance: this.entrance,
      floor: this.floor,
      apartment: this.apartment,
      deliveryDate: this.selectedDate,
      deliveryTime: this.selectedTime,
      payment: this.paymentMethod,
      change: this.change,
      bonusToUse: this.bonusToUse,
      summ: this.summ,
      bonus: this.bonus,
      callCustomer: this.callCustomer,
      comment: this.comment,
    };

    // Зберігаємо замовлення у базі даних
    const ordersCollectionRef = collection(this.afs, 'orders');
    try {
      const docRef = await addDoc(ordersCollectionRef, order);
      console.log('Документ успішно додано з ID:', docRef.id);
    } catch (error) {
      console.error('Помилка під час додавання документа:', error);
    }

    // Очищаємо кошик та перенаправляємо користувача на іншу сторінку
    localStorage.removeItem('basket');
    this.router.navigate(['/']);
  }
}
