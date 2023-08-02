import { Injectable } from '@angular/core';
import { ActionResponse } from '../../interfaces/action';
import { CollectionReference, Firestore, addDoc, collectionData, deleteDoc, doc, docData, updateDoc} from "@angular/fire/firestore";
import { collection, DocumentData } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private actionArr: Array<ActionResponse> = [];

  private actionCollection!: CollectionReference<DocumentData>;

  constructor(private afs: Firestore) {
    this.actionCollection = collection(this.afs, 'action');
  }

  getAll() {
    return collectionData(this.actionCollection, {
      idField: 'id',
    }) as Observable<Array<ActionResponse>>;
  }

  addAction(action: ActionResponse) {
    return addDoc(this.actionCollection, action);
  }

  getOneAction(id: string) {
    const actionDocumentReference = doc(this.afs, `action/${id}`);
    return docData(actionDocumentReference, { idField: 'id' });
  }

  editAction(action: ActionResponse, id: string) {
    const actionDocumentReference = doc(this.afs, `action/${id}`);
    return updateDoc(actionDocumentReference, { ...action });
  }

  delAction(id: string) {
    const actionDocumentReference = doc(this.afs, `action/${id}`);
    return deleteDoc(actionDocumentReference);
  }
}
