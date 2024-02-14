import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Injectable({
  providedIn : 'root'
})

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  userInfo: any;

  constructor() { }

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur depuis le localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      this.userInfo = JSON.parse(userString);
    } else {
      console.log('Aucune information utilisateur trouvée.');
    }
  }

  onLogout(): void {
    localStorage.clear()
    window.location.reload()
  }
}
