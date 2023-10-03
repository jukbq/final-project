import { Component, NgModule } from '@angular/core';
import {
  Firestore,
  collection,
  setDoc,
  deleteDoc,
  docData,
  where,
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { doc, getDocs, query, updateDoc } from 'firebase/firestore';

const LIST: any[] = [
  { name: 'Усі' },
  { name: 'В обробці' },
  { name: 'Виконано' },
];

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss'],
})
export class AdminOrderComponent {
  public userOrders: any = [];
  public list: any[] = LIST;
  public activeSection = 'В обробці';

  constructor(private afs: Firestore, private router: Router) {}

  ngOnInit(): void {
    this.getUserOrders();
  }

  onSelectItem(item: string): void {
    this.activeSection = item;
    this.getUserOrders();
  }

  async getUserOrders() {
    const ordersCollection = collection(this.afs, 'orders');

    try {
      const querySnapshot = await getDocs(ordersCollection);
       this.userOrders = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
         if (
           this.activeSection === 'Усі  ' ||
           orderData['status'] === this.activeSection
         ) {
           this.userOrders.push(orderData);
         }
        
     
        
        
      });
    } catch (error) {
      console.error('Помилка при отриманні замовлень:', error);
    }
  }

  async confirmOrder(orderNumber: any) {
    try {
      const ordersCollection = collection(this.afs, 'orders');
      const querySnapshot = await getDocs(
        query(ordersCollection, where('orderNumber', '==', orderNumber))
      );
      const docRef = querySnapshot.docs[0].ref;
      await setDoc(docRef, { status: 'Виконано' }, { merge: true });
      this.updatePage();
      console.log(`Замовлення ${orderNumber} підтверджено та статус оновлено.`);
    } catch (error) {
      console.error('Помилка підтвердження замовлення:', error);
    }
  }

  async deleteOrder(orderNumber: string) {
    try {
      const ordersCollection = collection(this.afs, 'orders');
      const querySnapshot = await getDocs(
        query(ordersCollection, where('orderNumber', '==', orderNumber))
      );
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      this.updatePage();
      console.log('Замовлення видалено.');
    } catch (error) {
      console.error('Помилка видалення замовлення:', error);
    }
  }

  updatePage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
