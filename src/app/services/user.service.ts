import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static readonly nameRef = 'User-maps';
  constructor(private firestore: Firestore) { }

  async addUser(user : User) {
    setDoc(doc(this.firestore, UserService.nameRef, user.getUuid()), JSON.parse(JSON.stringify(user)));
}

  async getUser(uuid: string) : Promise<any> {
    return getDoc(doc(this.firestore, UserService.nameRef, uuid));
  }

  async updateUser(uuid: string, data: User) {
      const item = doc(this.firestore, UserService.nameRef, uuid);
      await updateDoc(item, JSON.parse(JSON.stringify(data)));
  }
}
