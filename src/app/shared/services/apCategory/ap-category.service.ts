import { Injectable } from '@angular/core';
import {
  СategoriesRequest,
  СategoriesResponse,
} from '../../interfaces/categories';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';
import { APCategoryResponse } from '../../interfaces/additionalProductsCategory';

@Injectable({
  providedIn: 'root',
})
export class ApCategoryService {
  private apCategoriesArr!: Array<APCategoryResponse>;
  private apCategorieCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.apCategorieCollection = collection(
      this.afs,
      'additionalProductsCategory'
    );
  }

  getAll() {
    return collectionData(this.apCategorieCollection, { idField: 'id' });
  }

/*   getAllCategories(name: string) {
    return collectionData(this.apCategorieCollection, { idField: 'name' });
  } */

  addCategory(category: СategoriesRequest) {
    return addDoc(this.apCategorieCollection, category);
  }

  editCategory(category: СategoriesRequest, id: string) {
    const apCategorieDocumentReference = doc(
      this.afs,
      `additionalProductsCategory/${id}`
    );
    return updateDoc(apCategorieDocumentReference, { ...category });
  }

  delCategory(id: string) {
    const apCategorieDocumentReference = doc(
      this.afs,
      `additionalProductsCategory/${id}`
    );
    return deleteDoc(apCategorieDocumentReference);
  }
}
