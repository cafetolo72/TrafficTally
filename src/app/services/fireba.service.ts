import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Crosses} from '../crosses';
import { DocumentReference, deleteDoc, getDoc, getDocs } from 'firebase/firestore';
import { LoginComponent } from '../login/login.component';
import { Database } from './db/database';
import { Serialize } from './db/cross-seralize';

@Injectable({
  providedIn: 'root'
})
export class FirebaService {
  private static readonly nameRef = 'crosses';
  private static readonly nameUser = 'User-crosses';

  constructor(private firestore: Firestore) {}

  async getDocCross(id: string): Promise<DocumentReference>{
    return doc(this.firestore, FirebaService.nameRef, LoginComponent.currentUuid, FirebaService.nameUser, id);
  }

  async addCross(cross: Crosses){
    const docCross = await this.getDocCross(cross.getId().toString());
    await setDoc(docCross, Serialize.serializeCross(cross));
    this.saveTimestamp();
  }

  async updateCross(cross: Crosses): Promise<void> {
    const item = await this.getDocCross(cross.getId().toString())
    await updateDoc(item, Serialize.serializeCross(cross));
    this.saveTimestamp();
  }

  async removeCross(id : string){
    const item = await this.getDocCross(id);
    await deleteDoc(item);
    this.saveTimestamp();
  }

  async getCrosses(): Promise<Crosses[]> {
    try {
      await Database.loadDataCrosses();
      
      if(Database.getCrosses().length >= 1 && await this.isUpdated()){
        return Database.getCrosses().map(cross => Crosses.build(cross[1]) as Crosses);
      }

      const crossRef = doc(this.firestore, FirebaService.nameRef, LoginComponent.currentUuid);
      const crossesCollection = collection(crossRef, FirebaService.nameUser);
      const querySnapshot = await getDocs(crossesCollection);

      const crosses: Crosses[] = querySnapshot.docs.map(docSnap => Crosses.build(docSnap.data() as Crosses));
      crosses.forEach(cross => Database.saveCross(cross));
      return crosses;
    } catch (error) {
      console.error('Error al obtener los cruces del usuario:', error);
      throw error;
    }
  }

  async saveTimestamp(){
    const docTime = doc(this.firestore, FirebaService.nameRef, LoginComponent.currentUuid);
    getDoc(docTime).then( async dt =>{
      const time  = Serialize.getCurrentTimestamp();
      if(dt.data()){
        await updateDoc(docTime, time);
      }else{
        await setDoc(docTime, time);
      }
      Database.saveTime(time);
    })
  }

  async isUpdated(): Promise<boolean> {
    const docRef = doc(this.firestore, FirebaService.nameRef, LoginComponent.currentUuid);
    const timeLocal = localStorage.getItem('timestamp');

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const timeDB = docSnapshot.get('timestamp');
        if (timeLocal && timeDB) {
          const timeNum = JSON.parse(timeLocal)     
          return Number(timeNum.timestamp) == Number(timeDB);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }
}
