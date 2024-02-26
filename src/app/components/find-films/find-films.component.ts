import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


// Définition d'un type pour la tranche de date
type TrancheDate = {
  debut: number,
  fin: number
}

// Définition d'un type pour la durée d'épisode
type TrancheDuree = {
  debut: number,
  fin: number
}
@Component({
  selector: 'app-find-films',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    HttpClientModule,
    MatSnackBarModule
  ],
  templateUrl: './find-films.component.html',
  styleUrl: './find-films.component.css'
})
export class FindFilmsComponent {
  userInfo: any
  watchlist: any[] = []
  infini: number = Infinity
  genresUnique: string[] = []
  divVisible: string = "choixGenre"
  details: any[] = []
  detailsVisible: boolean[] = []

  isButtonDisabled: boolean = false

  // Tableau pour stocker les choix filtré
  filters: any = {
    genre: [],
    dateSortie: [],
    pressScore: [],
    duree: [],
  }

  choix_genre: string[] = []
  choix_dateSortie: TrancheDate[] = []
  choix_score: number[] = []
  choix_duree: TrancheDuree[] = []
  mots_clefs: string[] = []

  films: any = ""

  filmsFiltres: any[] = []

  historique: any[] = []

  constructor(private http: HttpClient, public snackbar: MatSnackBar) {
    this.extraireGenresUnique()
    this.selectRandomFilm()
  }

  ngOnInit(): void {
    // Récupère la bdd des films et je la stock dans la variable films
    this.http.get('http://localhost:8000/films/').subscribe({
      next: (response: any) => {
        this.films = response
        console.log("Films récupérés avec succès :", this.films)
        this.extraireGenresUnique()
      },
      error: (error: any) => {
        console.error("Erreur lors de la récupération des films", error)
      }
    })

    const userString = localStorage.getItem("user")
    if (userString) {
      this.userInfo = JSON.parse(userString)
      this.initializeWatchlist()
    } else {
      console.log("Aucune information utilisateur trouvée")
    }
  }


  onLogout(): void {
    localStorage.clear()
    window.location.reload()
    this.detailsVisible = new Array(this.historique.length).fill(false)
  }
  // Initialisation watchlist
  initializeWatchlist() {
    const apiUrl = `http://localhost:8000/watchlist/`

    const headers = new HttpHeaders().set(
      "Authorization",
      `Token ${localStorage.getItem("token")}`
    )

    this.http.get(apiUrl, { headers }).subscribe({
      next: (response: any) => {
        this.watchlist = response
        console.log("Watchlist récupérée avec succès :", response)
      },
      error: (error: any) => {
        console.error("Erreur lors de la récupération de la watchlist", error)
      }
    })
  }

  isThisFilmWatchlist(film: any): boolean {
    return this.watchlist.some((entry: any) => entry.titre === film.titre)
  }

  isThisFilmHistorique(film: any): boolean {
    return this.historique.some((entry: any) => entry.titre === film.titre)
  }

  // NE PAS OUBLIER D'ENLEVER CETTE PARTIE
  clear() {
    console.clear
  }
  // -----------------------------------------

  // Méthode pour choisir les genres
  choisirGenre(genreSelectionne: string): void {
    const index = this.choix_genre.indexOf(genreSelectionne)
    if (index > -1) {
      // Si genre déjà selectionné je le retire du tableau
      this.choix_genre.splice(index, 1)
      this.filters.splice(index, 1)
    } else {
      // Sinon on l'ajoute au tableau
      this.choix_genre.push(genreSelectionne)
      this.filters.genre.push(genreSelectionne)
    }
  }

  // Méthode pour vérifier si deux tranches sont égales
  tranchesEgalesDate(tranche1: TrancheDate, tranche2: TrancheDate): boolean {
    // Vérifie si la date de début et la date de fin des deux tranches sont égales
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  // Méthode pour la vérifier si la tranche est déjà selectionnée
  tranchesIndexDate(trancheSelectionneeDate: TrancheDate): number {
    // Parcourir toutes les tranches de la liste choix_dateSortie
    for (let i = 0; i < this.choix_dateSortie.length; i++) {
      // Vérifie si la tranche actuelle est égale à la tranche selectionnée
      if (this.tranchesEgalesDate(this.choix_dateSortie[i], trancheSelectionneeDate)) {
        // Si les tranches sont égales, retourne l'indice de la tranche selectionnée dans choix_dateSortie
        return i
      }
    }
    return -1
  }
  // Méthode pour choisir le score
  choisirScore(scoreSelectionne: number): void {
    const index = this.choix_score.indexOf(scoreSelectionne)
    if (index > -1) {
      this.choix_score.splice(index, 1)
      this.filters.pressScore.splice(index, 1)
    } else {
      this.choix_score.push(scoreSelectionne)
      this.filters.pressScore.push(scoreSelectionne)
    }
  }
  // Méthode pour choisir les tranches de date
  choisirTrancheDate(trancheSelectionneeDate: TrancheDate): void {
    // Véririfer si la tranche est déjà selectionnée
    const index = this.tranchesIndexDate(trancheSelectionneeDate)
    if (index > -1) {
      // Si la tranche est selectionnée, la retirer du tableau
      this.choix_dateSortie.splice(index, 1)
      this.filters.dateSortie.splice(index, 1)
    } else {
      // Sinon l'ajouter au tableau
      this.choix_dateSortie.push(trancheSelectionneeDate)
      this.filters.dateSortie.push(trancheSelectionneeDate)
    }
  }

  // Méthode pour vérifier si une tranche est sélectionnée parmi un ensemble de tranches
  isTrancheDateSelected(tranche: TrancheDate): boolean {
    // Vérifie si au moins une des tranches dans le choix a la meme date de début et de fin que la tranche en argument
    return this.choix_dateSortie.some(t => t.debut === tranche.debut && t.fin === tranche.fin)
  }

  // Méthode pour vérifier si deux tranches sont égales
  tranchesEgalesDuree(tranche1: TrancheDuree, tranche2: TrancheDuree): boolean {
    // Vérifie si la date de début et la date de fin des deux tranches sont égales
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  // Méthode pour la vérifier si la tranche est déjà selectionnée
  tranchesIndexDuree(trancheSelectionneeDuree: TrancheDuree): number {
    // Parcourir toutes les tranches de la liste choix_duree
    for (let i = 0; i < this.choix_duree.length; i++) {
      // Vérifie si la tranche actuelle est égale à la tranche selectionnée
      if (this.tranchesEgalesDuree(this.choix_duree[i], trancheSelectionneeDuree)) {
        // Si les tranches sont égales, retourne l'indice de la tranche selectionnée dans choix_duree
        return i
      }
    }
    return -1
  }

  // Méthode pour choisir les tranches de duree
  choisirTrancheDuree(trancheSelectionneeDuree: TrancheDuree): void {
    // Véririfer si la tranche est déjà selectionnée
    const index = this.tranchesIndexDuree(trancheSelectionneeDuree)
    if (index > -1) {
      // Si la tranche est selectionnée, la retirer du tableau
      this.choix_duree.splice(index, 1)
      this.filters.duree.splice(index, 1)
    } else {
      // Sinon l'ajouter au tableau
      this.choix_duree.push(trancheSelectionneeDuree)
      this.filters.duree.push(trancheSelectionneeDuree)
    }
  }

  // Méthode pour vérifier si une tranche est sélectionnée parmi un ensemble de tranches
  isTrancheDureeSelected(tranche: TrancheDuree): boolean {
    // Vérifie si au moins une des tranches dans le choix a la meme duree de début et de fin que la tranche en argument
    return this.choix_duree.some(t => t.debut === tranche.debut && t.fin === tranche.fin)
  }

  // Méthode pour extraire les genres uniques
  private extraireGenresUnique() {
    for (let film of this.films) {
      if (film.genres) {
        // Retirer les crochets et les apostrophes pour obtenir une chaîne de genres
        let genresString = film.genres.replace(/[\[\]']+/g, '');
        // Diviser la chaîne en un tableau de genres
        let genresArray = genresString.split(',').map((genre: string) => genre.trim());
        for (let genre of genresArray) {
          // Vérifier si le genre n'est pas déjà dans le tableau genresUnique
          if (!this.genresUnique.includes(genre)) {
            this.genresUnique.push(genre);
          }
        }
      }
    }
    console.log("Genres uniques:", this.genresUnique);
  }





  // Méthode pour selectionner le film de manière aléatoire
  public selectedRandomFilm: any;

  public selectRandomFilm() {
    if (!this.filters.genre || this.filters.genre.length === 0) {
      console.log("Veuillez sélectionner au moins un genre");
      return null;
    }
  
    // Filtre les films qui correspondent aux critères
    const filmsFiltres = this.films.filter((film: any) => {
      // Vérifie si le film est déjà dans la watchlist ou l'historique
      if (this.isThisFilmWatchlist(film) || this.isThisFilmHistorique(film)) {
        return false;
      }
  
      // Vérifie les genres
      const genrePresent = film.genres && this.filters.genre.some((genre: string) => film.genres.indexOf(genre) !== -1);
  
      // Vérifie les tranches de date
      const dateSortieInclus = this.filters.dateSortie.some((tranche: TrancheDate) => {
        return film.date_de_sortie >= tranche.debut && film.date_de_sortie <= tranche.fin;
      });
  
      // Vérifie les tranches de durée
      const dureeInclus = this.filters.duree.some((tranche: TrancheDuree) => {
        return film.duree >= tranche.debut && film.duree <= tranche.fin;
      });
  
      // Vérifie les scores
      const pressScoreInclus = this.filters.pressScore.includes(parseFloat(film.press_score));
  
      return genrePresent && dateSortieInclus && dureeInclus && pressScoreInclus;
    });
  
    // Désactiver le bouton si une seule série est disponible
    this.isButtonDisabled = filmsFiltres.length <= 1;
  
    // Afficher le contenu du tableau filtré
    console.log("Films filtrés : ", filmsFiltres);
  
    if (filmsFiltres.length === 0) {
      console.log("Aucun film trouvé");
      return null;
    }
  
    // Logique pour sélectionner un film aléatoire
    const randomIndex = Math.floor(Math.random() * filmsFiltres.length);
    this.selectedRandomFilm = filmsFiltres[randomIndex];
    console.log("Films sélectionné :", this.selectedRandomFilm)
    this.historique.push(this.selectedRandomFilm);
    return this.selectedRandomFilm;
  }
  
  
  
  

  // Mise en place des slides de choix
  // Méthodes pour les fonctions du click qui changent la div
  suivant() {
    if (this.divVisible === "choixGenre") {
      this.divVisible = "choixDuree"
    } else if (this.divVisible === "choixDuree") {
      this.divVisible = "dateSortie"
    } else if (this.divVisible === "dateSortie") {
      this.divVisible = "pressScore"
    } else if (this.divVisible === "pressScore") {
      this.selectRandomFilm()
      this.divVisible = "filmAleatoire"
    }
  }

  retour() {
    if (this.divVisible === "filmAleatoire") {
      this.divVisible = "pressScore"
    } else if (this.divVisible === "pressScore") {
      this.divVisible = "dateSortie"
    } else if (this.divVisible === "dateSortie") {
      this.divVisible = "choixDuree"
    } else if (this.divVisible === "choixDuree") {
      this.divVisible = "choixGenre"
    }
  }

  // Ajouter film à la watchlist
  ajouterWatchlist(selectedFilm: any): void {
    if (!this.userInfo) {
      console.error("Informations utilisateur non disponibles.")
      return
    }

    // Définir l'url de l'api de Django pour la watchlist
    const apiUrl = 'http://localhost:8000/watchlist/'

    // Définir les données à envoyer
    const data = {
      user_id: this.userInfo.id,
      titre: selectedFilm.titre,
      illustration: selectedFilm.illustration_url,
      vu: false,
      a_regarder_plus_tard: true,
      type: selectedFilm.genre_oeuvre,
      duree: selectedFilm.duree_en_minutes,
      date_sortie: selectedFilm.date_de_sortie
    }

    // Définir l'en-tête de la requête
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token')
      })
    }

    // Envoyer la requête POST à l'api DJANGO
    this.http.post(apiUrl, data, httpOptions).subscribe({
      next: (response: any) => {
        console.log("Film ajouté avec succès à la watchlist", response)
        this.openSnackBar("Film ajouté à la watchlist", "Fermer", "succes-snack")
      },
      error: (error: any) => {
        console.error("Erreur lors de l'ajout", error)
        this.openSnackBar("Erreur, film déjà ajouté à la watchlist", "Fermer", "error-snack")
      }
    })
  }

  // Méthode pour ajouter le film en déjà vu
  dejaVu(selectedFilm: any): void {
    if (!this.userInfo) {
      console.error("Informations utilisateur non disponibles.")
      return
    }

    // Définir l'url de l'api de Django pour la watchlist
    const apiUrl = 'http://localhost:8000/watchlist/'

    // Définir les données à envoyer
    const data = {
      user_id: this.userInfo.id,
      titre: selectedFilm.titre,
      illustration: selectedFilm.illustration_url,
      vu: true,
      a_regarder_plus_tard: true,
      type: selectedFilm.genre_oeuvre,
      duree: selectedFilm.duree_en_minutes,
      date_sortie: selectedFilm.date_de_sortie
    }

    // Définir l'en-tête de la requête
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token')
      })
    }

    // Envoyer la requête POST à l'api DJANGO
    this.http.post(apiUrl, data, httpOptions).subscribe({
      next: (response: any) => {
        console.log("Film ajouté avec succès à la watchlist", response)
        this.openSnackBar("Film ajouté à la watchlist", "Fermer", "succes-snack")
      },
      error: (error: any) => {
        console.error("Erreur lors de l'ajout", error)
        this.openSnackBar("Erreur, film déjà ajouté à la watchlist", "Fermer", "error-snack")
      }
    })
  }

  // Pop up lors du clique sur le bouton ajouté à la watchlist
  openSnackBar(message: string, action: string, className: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [className]
    })
  }

  // Méthode pour afficher les détails de l'historique
  showDetails(oeuvre: any, index: number) {
    if (!this.detailsVisible[index]) {
      this.detailsVisible[index] = true
      this.details = [
        oeuvre.titre,
        oeuvre.illustration_url,
        oeuvre.press_score,
        oeuvre.date_de_sortie,
        oeuvre.genres,
        oeuvre.synposis,
        oeuvre.duree_en_minutes
      ]
    } else {
      this.detailsVisible[index] = false
    }
  }

  hideDetails(): void {
    this.detailsVisible.fill(false)
  }
}
