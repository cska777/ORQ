import { Component, Injectable, OnInit } from '@angular/core';
import { WatchlistService } from '../../watchlist.service';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

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
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit{
watchlist: any[] = [];
  userInfo: any;
  token: string | null = null;

  constructor(private watchlistService: WatchlistService, private http: HttpClient) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      console.log("Aucun token d'authentification trouvé.");
    } else {
      this.getLoggedInUserInfo();
      this.getWatchlist();
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

  removeFromWatchlist(seriesId: number): void {
    if (this.token) {
      this.watchlistService.removeFromWatchlist(seriesId, this.token).subscribe({
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
}
