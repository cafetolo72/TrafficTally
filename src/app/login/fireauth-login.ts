import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  browserSessionPersistence
} from '@angular/fire/auth';
import { Database } from '../services/db/database';
import { ListenersService } from '../services/listeners.service';

export interface LoginData {
  email: string;
  password: string;
}

export class FireLoginService {
  private static readonly nameRef = 'users';
  private loggedInUser: UserCredential | null = null;

  constructor( private auth: Auth) {
    const storedUser = Database.getItem(FireLoginService.nameRef);
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser);
    }
  }

  async login({ email, password }: LoginData, rememberMe: boolean) : Promise<UserCredential>{
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        if (persistenceType) {
          return this.auth.setPersistence(persistenceType).then(() => {
            Database.setCurrentUser(FireLoginService.nameRef, JSON.stringify(userCredential));
            this.setUserActive(userCredential);
            return userCredential;
          });
        }
        Database.setCurrentUser(FireLoginService.nameRef, JSON.stringify(userCredential));
        this.setUserActive(userCredential);
        return userCredential;
      });
  }

  async loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async register({ email, password }: LoginData, rememberMe: boolean) {
    const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(userCredential => {
        if (persistenceType) {
          return this.auth.setPersistence(persistenceType).then(() => {
            Database.setCurrentUser(FireLoginService.nameRef, JSON.stringify(userCredential));
            this.setUserActive(userCredential);
            return userCredential;
          });
        }
        Database.setCurrentUser(FireLoginService.nameRef, JSON.stringify(userCredential));
        this.setUserActive(userCredential);
        return userCredential;
      });
  }

  setUserActive(userCredential: UserCredential){
    this.loggedInUser = userCredential
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getLoggedInUser(): UserCredential | null {
    return this.loggedInUser;
  }

  getUuid(): string{
    const uuid = this.getLoggedInUser()?.user.uid; 
    return uuid ? uuid : '';
  }

  async logout() {
    Database.remove(FireLoginService.nameRef);
    this.loggedInUser = null;
    ListenersService.getInstance().setListenerUser(false);
    return signOut(this.auth);
  }
}
