import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfo : any
  

  constructor() { }

  setUserInfo(userInfo:any): void{
    this.userInfo = userInfo
  }

  getUserInfo():any{
    return this.userInfo
  }

  updateUsername(newUsername: string): void {
    if (this.userInfo) {
      this.userInfo.username = newUsername
       // Mise à jour du localStorage après la modification du nom d'utilisateur
      localStorage.setItem('user', JSON.stringify(this.userInfo))
    } else {
      console.error("User info n'est pas défini")
    }
  }
  

  loadUserInfo(): void {
    const userString = localStorage.getItem('user')
    if (userString) {
      this.userInfo = JSON.parse(userString)
    } else {
      console.log('Aucune information utilisateur trouvée.')
    }
  }
}
