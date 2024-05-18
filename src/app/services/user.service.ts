import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IUser} from "../entity/user";
import {StorageMap} from "@ngx-pwa/local-storage";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user = new BehaviorSubject<IUser | any>({});
  public user$ = this.user.asObservable();
  private showLoginModal = new BehaviorSubject<boolean>(false);
  public showLoginModal$ = this.showLoginModal.asObservable();

  constructor(
    private storage: StorageMap,
  ) {
    this.storage.get('user').subscribe(user => this.user.next(user as IUser));
  }

  setUser = (user: IUser) => {
    this.storage.set('user', user).subscribe(() => this.user.next(user));
  }

  deleteUser = () => {
    this.storage.delete('user').subscribe(() => this.user.next(null));
  }

  setShowLoginModal = (isLogin: boolean) => this.showLoginModal.next(isLogin)

}
