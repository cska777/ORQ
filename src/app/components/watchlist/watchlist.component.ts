import { Component, Injectable, OnInit } from '@angular/core';
import { WatchlistService } from '../../watchlist.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { response } from 'express';
import { FormsModule } from '@angular/forms';
import { error } from 'console';

@Injectable({
  providedIn : 'root'
})

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    NgFor,
    FormsModule,
    NgClass
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit{
watchlist: any[] = [];
userInfo: any;
token: string | null = null;
watchlistEntry: any;

// Propriété pour stocker temporairement les informations du textarea

monAvisTemp : string = ""

  constructor(private watchlistService: WatchlistService, private http: HttpClient) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      console.log("Aucun token d'authentification trouvé.");
    } else {
      this.getLoggedInUserInfo();
      this.getWatchlist();
      console.log("token : ", this.token)
    }
  }

  getLoggedInUserInfo() {
    if (this.token) {
      const headers = new HttpHeaders().set('Authorization', `Token ${this.token}`);
      this.http.get<any>('http://localhost:8000/test_token/', { headers }).subscribe({
        next: (response: any) => {
          console.log('Informations utilisateur:', response);
        },
        error: (error: any) => {
          console.log('Erreur lors de la récupération des informations utilisateur', error);
        }
      });
    }
  }

  getWatchlist(): void {
    if (this.token) {
      this.watchlistService.getWatchlist(this.token).subscribe({
        next: (data: any[]) => {
          this.watchlist = data;
          console.log('Watchlist retrieved successfully:', data);
        },
        error: (error: any) => {
          console.error('Error fetching watchlist:', error);
        }
      });
    }
  }

  addToWatchlist(selectedSerie: any): void {
    if (this.token) {
      this.watchlistService.addToWatchlist(selectedSerie, this.token).subscribe({
        next: (response: any) => {
          console.log('Série ajoutée à la watchlist:', response);
          this.getWatchlist();
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'ajout:', error);
        }
      });
    }
  }

  updateWatchlist(oeuvreId:number, updated:any): void{
    if(this.token){
      this.watchlistService.updateWatchlist(oeuvreId, updated, this.token).subscribe({
        next : (response: any) => {
          console.log('Entrée de la watchlist mise à jour avec Succès : ', response)
          this.getWatchlist()
        },
        error : (error : any) => {
          console.error('Erreur lors de la mise à jour de l\'entrée de la watchlist:', error);
        }
      })
    }
  }

  removeFromWatchlist(oeuvreId: number): void {
    if (this.token) {
      console.log("serie id : ", oeuvreId)
      this.watchlistService.removeFromWatchlist(oeuvreId, this.token).subscribe({
        next: (response: any) => {
          console.log('Série retirée de la watchlist:', response);
          this.getWatchlist();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  // Méthode pour mettre à jour temporairement les informations du textarea
  updateTempMonAvis(event: any){
    if(event &&  event.target && event.target.value){
      this.monAvisTemp = event.target.value
    }

  }

  // Méthode pour envoyer les informations du textarea au serveur
  sendMonAvis(oeuvreId : number){
    if(this.token){
      this.watchlistService.updateWatchlist(oeuvreId,{mon_avis:this.monAvisTemp}, this.token).subscribe({
        next:(response:any) => {
          console.log("Série retirée de la watchlist :", response)
          this.getWatchlist()
        },
        error: (error : any) => {
          console.error("Erreur lors de l'envoi de mon avis",error)
        }
      })
    }
  }
}
