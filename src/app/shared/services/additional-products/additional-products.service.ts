import { Injectable } from '@angular/core';
import { AdditionalProductsRequest, AdditionalProductsResponse } from '../../interfaces/additional-products';
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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdditionalProductsService {
  private additionalProductsArr: Array<AdditionalProductsResponse> = [];
  private additionalProductsCollectio!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.additionalProductsCollectio = collection(
      this.afs,
      'additionalProducts'
    );
  }

  getAll() {
    return collectionData(this.additionalProductsCollectio, {
      idField: 'id',
    }) as Observable<Array<AdditionalProductsResponse>>;
  }

  addAdditionalProducts(additionalProducts: AdditionalProductsRequest) {
    return addDoc(this.additionalProductsCollectio, additionalProducts);
  }

  editAdditionalProductss(
    additionalProducts: AdditionalProductsRequest,
    id: string
  ) {
    const additionalProductsDocumentReference = doc(
      this.afs,
      `additionalProducts/${id}`
    );
    return updateDoc(additionalProductsDocumentReference, {
      ...additionalProducts,
    });
  }

  delAdditionalProductss(id: string) {
    const additionalProductsDocumentReference = doc(this.afs, `additionalProducts/${id}`);
    return deleteDoc(additionalProductsDocumentReference);
  }
}
