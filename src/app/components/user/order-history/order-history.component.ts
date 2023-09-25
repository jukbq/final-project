import { Component } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { doc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent {
  public uid = '';
  public userOrders: any = [];
  public orderArray: any = [];

  constructor(private afs: Firestore) {}

  ngOnInit(): void {
    this.userInfo();
    this.getUserOrders();
  }

  //Отримання uid користувача
  userInfo() {
    let user = JSON.parse(localStorage.getItem('curentUser') as string);
    this.uid = user.uid;
  }

  async getUserOrders() {
    const ordersCollection = collection(this.afs, 'orders');
    const q = query(ordersCollection, where('uid', '==', this.uid));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        const orders = orderData['orderedItems'];
        this.userOrders.push(orderData);
        this.orderArray.push(orders);
        console.log(this.orderArray);
      });
    } catch (error) {
      console.error('Помилка при отриманні замовлень:', error);
    }
  }
}
