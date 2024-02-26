import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(private http:HttpClient){}

  isUserLoggedIn = false
  token: string | null = null
  userInfo : any

  ngOnInit(): void {
    this.token = localStorage.getItem('token')
    if(!this.token){
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
