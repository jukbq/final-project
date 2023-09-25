import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrderResponse } from '../../interfaces/order';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  DocumentReference,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  public chageBasket = new Subject<boolean>();
  private orderCollection: string = 'orders';

  constructor(private afs: Firestore) {}

  getAll(): Observable<Array<OrderResponse>> {
    return collectionData(collection(this.afs, this.orderCollection), {
      idField: 'id',
    }) as Observable<Array<OrderResponse>>;
  }

  addOrder(order: any): Promise<DocumentReference> {
    return addDoc(collection(this.afs, this.orderCollection), order);
  }

  getGoodsOrder(id: string): Observable<OrderResponse> {
    const orderDocumentReference = doc(
      this.afs,
      `${this.orderCollection}/${id}`
    );
    return docData(orderDocumentReference, {
      idField: 'id',
    }) as Observable<OrderResponse>;
  }

  delOrder(id: string): Promise<void> {
    const orderDocumentReference = doc(
      this.afs,
      `${this.orderCollection}/${id}`
    );
    return deleteDoc(orderDocumentReference);
  }
}
