import { Injectable } from '@angular/core';
import { СategoriesRequest, СategoriesResponse } from '../../interfaces/categories';
import { CollectionReference, Firestore, addDoc, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesArr!: Array<СategoriesResponse>;
  private categoriesCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.categoriesCollection = collection(this.afs, 'categories');
  }

  getAll() {
    return collectionData(this.categoriesCollection, { idField: 'id' });
  }

  getAllCategories(name: string) {
    return collectionData(this.categoriesCollection, { idField: 'name' });
  }

  addCategory(category: СategoriesRequest) {
    return addDoc(this.categoriesCollection, category);
  }

  editCategory(category: СategoriesRequest, id: string) {
    const catrgoryDocumentReference = doc(this.afs, `categories/${id}`);
    return updateDoc(catrgoryDocumentReference, { ...category });
  }

  delCategory(id: string) {
    const catrgoryDocumentReference = doc(this.afs, `categories/${id}`);
    return deleteDoc(catrgoryDocumentReference);
  }
}
