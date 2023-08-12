import { Injectable } from '@angular/core';
import { MenuResponse } from '../../interfaces/menu';
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
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuArr!: Array<MenuResponse>;
  private menuCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.menuCollection = collection(this.afs, 'menu');
  }

  getAll() {
    return collectionData(this.menuCollection, { idField: 'id' });
  }

  getAllmenu(name: string) {
    return collectionData(this.menuCollection, { idField: 'name' });
  }
/* 
  addMenu(menu: MenuResponse) {
    return addDoc(this.menuCollection, menu);
  }

  editCategory(menu: MenuResponse, id: string) {
    const menuDocumentReference = doc(this.afs, `menu/${id}`);
    return updateDoc(menuDocumentReference, { ...menu });
  }

  delCategory(id: string) {
    const menuDocumentReference = doc(this.afs, `menu/${id}`);
    return deleteDoc(menuDocumentReference);
  } */
}
