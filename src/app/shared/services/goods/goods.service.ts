import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GoodsRequest, GoodsResponse } from '../../interfaces/goods';
import {
  addDoc,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { collection, DocumentData } from '@firebase/firestore';
import { query } from '@angular/animations';


@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  private goodsArr: Array<GoodsResponse> = [];
  private goodsCollectio!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.goodsCollectio = collection(this.afs, 'goods');
  }

  getAll() {
    return collectionData(this.goodsCollectio, { idField: 'id' }) as Observable<
      Array<GoodsResponse>
    >;
  }
  getOneGoods(id: string) {
    console.log('id продукта', id);
    const goodsDocumentReference = doc(this.afs, `goods/${id}`);
    return docData(goodsDocumentReference, { idField: 'id' });
  }

  addGoods(goods: GoodsRequest) {
    return addDoc(this.goodsCollectio, goods);
  }

  editGoods(goods: GoodsRequest, id: string) {
    const goodsDocumentReference = doc(this.afs, `goods/${id}`);
    return updateDoc(goodsDocumentReference, { ...goods });
  }

  delGoods(id: string) {
    const goodsDocumentReference = doc(this.afs, `goods/${id}`);
    return deleteDoc(goodsDocumentReference);
  }
}
