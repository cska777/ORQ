import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    imports: [
        RouterLink,
        NgIf,
    ]
})
export class NavbarComponent implements OnInit {

  constructor(private http:HttpClient){}

  isUserLoggedIn = false
  userInfo : any

  ngOnInit(): void {
    const userString = localStorage.getItem('user')
    if(userString){
      this.userInfo = JSON.parse(userString)
    }else{
      console.log('Aucune information utilisateur trouvée.')
    }
    const token = localStorage.getItem('token')
    if(!token){
      console.log("Aucun token d'authentification trouvé")
    } else {
      this.isUserLoggedIn = true
    }
  }

  onLogout(): void {
    localStorage.clear()
    window.location.reload()
  }

}
