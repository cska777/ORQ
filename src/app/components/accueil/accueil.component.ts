import { Component, Injectable } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import jsonData from '../../data/allocine_cinema.json'

@Injectable({
  providedIn : 'root'
})

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    RouterLink,
    NgFor
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {
  userInfo: any
  filmsCinema : any = jsonData

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
