import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { WatchlistService } from '../../watchlist.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OeuvreDetailsComponent } from '../oeuvre-details/oeuvre-details.component';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    NgFor,
    FormsModule,
    NgClass,
    NgStyle
  ],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];
  userInfo: any;
  token: string | null = null;
  watchlistEntry: any;
  watchlistSections: { [key: string]: any[][] } = {
    enCours: [],
    dejaVu: [],
    nonVu: []
  };
  

  // Propriété pour stocker temporairement les informations du textarea

  monAvisTemp: string = ""

  constructor(private watchlistService: WatchlistService, private http: HttpClient, private dialog:MatDialog) { }

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
          this.watchlistSections = {
            enCours: this.generateSections(this.watchlist, 'enCours'),
            dejaVu: this.generateSections(this.watchlist, 'dejaVu'),
            nonVu: this.generateSections(this.watchlist, 'nonVu')
          }
          console.log('Watchlist retrieved successfully:', data);
          console.log('Watchlist sections:', this.watchlistSections);
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

  updateWatchlist(oeuvreId: number, updated: any): void {
    if (this.token) {
      this.watchlistService.updateWatchlist(oeuvreId, updated, this.token).subscribe({
        next: (response: any) => {
          console.log('Entrée de la watchlist mise à jour avec Succès : ', response)
          this.getWatchlist()
        },
        error: (error: any) => {
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
  updateTempMonAvis(event: any) {
    if (event && event.target && event.target.value) {
      this.monAvisTemp = event.target.value
    }
  }

  // Méthode pour envoyer les informations du textarea au serveur
  sendMonAvis(oeuvreId: number) {
    if (this.token) {
      this.watchlistService.updateWatchlist(oeuvreId, { mon_avis: this.monAvisTemp }, this.token).subscribe({
        next: (response: any) => {
          console.log("Série retirée de la watchlist :", response)
          this.getWatchlist()
        },
        error: (error: any) => {
          console.error("Erreur lors de l'envoi de mon avis", error)
        }
      })
    }
  }

  currentIndex = 0;

  generateSections(watchlist: any[],status: string): any[][] {
    if (!watchlist) {
      return [];
    }
  
    // Filtrer les oeuvres en fonction du statut vu
    const filteredWatchlist = watchlist.filter((oeuvre:any) => {
      if(status === 'nonVu'){
        return !oeuvre.vu && !oeuvre.en_cours
      }else if(status === 'enCours'){
        return oeuvre.en_cours
      }else if(status ==='dejaVu'){
        return oeuvre.vu
      }
      return false
    })

    const sections = [];
    let section: any[] = [];
    const itemsPerSection = 6;

    // Utiliser la liste filtrée pour générer les sections
  for (let i = 0; i < filteredWatchlist.length; i++) {
    if (section.length === itemsPerSection) {
      sections.push(section);
      section = [];
    }
    section.push(filteredWatchlist[i]);
  }

  if (section.length > 0) {
    sections.push(section);
  }  
    return sections;
  }
  
  

  @ViewChild('watchlater')
  watchlaterRef!: ElementRef;
  @ViewChild('enCours')
  enCoursRef!: ElementRef;
  @ViewChild('dejaVu')
  dejaVuRef!: ElementRef;

  // Déclarez les variables d'index et initialisez-les dans le ngOnInit
  currentIndexWatchLater: number = 0;
  currentIndexEnCours: number = 0;
  currentIndexDejaVu: number = 0;

  // Modifiez la méthode moveWrapper() pour prendre en compte les indices corrects
  moveWrapper(direction: number, wrapperRef: ElementRef, wrapperType: string) {
    let maxIndex;
  
    switch (wrapperType) {
      case 'watchlater':
        maxIndex = this.watchlistSections['nonVu'].length - 1;
        break;
      case 'enCours':
        maxIndex = this.watchlistSections['enCours'].length - 1;
        break;
      case 'dejaVu':
        maxIndex = this.watchlistSections['dejaVu'].length - 1;
        break;
      default:
        maxIndex = 0;
    }
  
    let currentIndex: number;
  
    switch (wrapperType) {
      case 'watchlater':
        currentIndex = this.currentIndexWatchLater;
        break;
      case 'enCours':
        currentIndex = this.currentIndexEnCours;
        break;
      case 'dejaVu':
        currentIndex = this.currentIndexDejaVu;
        break;
      default:
        currentIndex = 0;
    }
  
    const wrapper = wrapperRef.nativeElement.querySelector('.wrapper__sections') as HTMLElement;
  
    if (wrapper) {
      let newIndex = currentIndex + direction;
  
      if (newIndex < 0) {
        newIndex = maxIndex;
      } else if (newIndex > maxIndex) {
        newIndex = 0;
      }
  
      wrapper.style.transition = 'transform 0.5s ease-in-out';
      wrapper.style.transform = 'translateX(' + newIndex * -100 + '%)';
  
      // Mettre à jour l'index approprié en fonction du type de wrapper
      switch (wrapperType) {
        case 'watchlater':
          this.currentIndexWatchLater = newIndex;
          break;
        case 'enCours':
          this.currentIndexEnCours = newIndex;
          break;
        case 'dejaVu':
          this.currentIndexDejaVu = newIndex;
          break;
        default:
          break;
      }
    }
  }

  // Gestion du popup pour les détail
  openDetails(oeuvre:any) : void{
    const dialogRef = this.dialog.open(OeuvreDetailsComponent,{
      width: '1000px',
      height : '60%', 
      data : {oeuvre}
    })
  }
}
