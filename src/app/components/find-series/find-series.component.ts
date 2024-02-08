import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import jsonData from '../../data/allocine_top_series.json'

// Définition d'un type pour représenter la tranche de date
type TrancheDate = {
  debut: number, // Date de début de la tranche
  fin: number // Date de fin de la tranche
}

// Définition d'un type pour la durée d'éspidoe
type TrancheDuree = {
  debut: number,
  fin: number
}

@Component({
  selector: 'app-find-series',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './find-series.component.html',
  styleUrl: './find-series.component.css'
})
export class FindSeriesComponent {

  infini : number = Infinity

  constructor() {
    // Appel de la méthode pour extraire les genres uniques
    this.extraireGenresUnique()
    this.selectRandomSerie()

  }

  // Tableau pour stocker les choix et filtré
  filters: any = {
    genre: [],
    dateSortie: [],
    pressScore: [],
    dureeEpisode: []
  }

  //tableau pour récupérer le choix des genres
  choix_genre: string[] = []

  //tableau pour récuéprer le choix de date
  choix_dateSortie: TrancheDate[] = []

  //tableau pour récupérer le choix de note
  choix_score: number[] = []

  //tableau pour récupérer la drueeEp 
  choix_dureeEp: TrancheDuree[] = []

  // tableau pour les mots clés
  mots_clefs: string[] = []

  // Je stocke les informations de mon fichier json dans une variable
  // pour pouvoir l'utiliser dans ma vue
  series: any = jsonData

  // Tableua pour les séries filtrée
  seriesFiltrees: any[] = []

  // !!!!!!!!!!!!!!!!!  NOTE POUR MOI MEME NE PAS OUBLIER DE L'ENLEVER !!!!!!!!!!!!!!!!
  selectAll(): void {
    // Sélection de tous les genres disponibles
    this.genresUnique.forEach(genre => this.choisirGenre(genre));

    // Sélection de toutes les tranches de date disponibles
    // Vous devez définir vos propres tranches de date ici
    const toutesLesTranches: TrancheDate[] = [{ debut: 0, fin: 1970 }, { debut: 1971, fin: 1990 }, { debut: 1991, fin: 2010 }, { debut: 2011, fin: this.infini }];
    toutesLesTranches.forEach(tranche => this.choisirTrancheDate(tranche));

    // Sélection de tous les scores disponibles
    // Vous devez définir vos propres scores ici
    const tousLesScores: number[] = [1, 2, 3, 4, 5];
    tousLesScores.forEach(score => this.choisirScore(score));
  }
  clear() {
    console.clear()
  }
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // fonction pour choisir les genres
  choisirGenre(genreSelectionne: string): void {
    const index = this.choix_genre.indexOf(genreSelectionne)
    if (index > -1) {
      // Si le genre est déjà selectionnée je le retire du tableau
      this.choix_genre.splice(index, 1)
      this.filters.genre.splice(index, 1)
    } else {
      // Sinon on l'ajoute au tableau
      this.choix_genre.push(genreSelectionne)
      this.filters.genre.push(genreSelectionne)
    }
  }

  //fonction pour choisir les tranches de date
  choisirTrancheDate(trancheSelectionneeDate: TrancheDate): void {
    // Vérifier si la tranche est déjà slectionnée
    const index = this.tranchesIndexDate(trancheSelectionneeDate)
    if (index > -1) {
      // Si la tranche est selectionnée, le retirer du tableau
      this.choix_dateSortie.splice(index, 1)
      this.filters.dateSortie.splice(index, 1)
    } else {
      // Sinon l'ajouter au tableau
      this.choix_dateSortie.push(trancheSelectionneeDate)
      this.filters.dateSortie.push(trancheSelectionneeDate)
    }

  }

  //fonction pour vérifier si la tranche est déjà sélectionnée
  tranchesIndexDate(trancheSelectionneeDate: TrancheDate): number {
    // Parcours toutes les tranches dans la liste choix_dateSortie
    for (let i = 0; i < this.choix_dateSortie.length; i++) {
      // Vérifie si la tranche actuelle de choix_dateSortie est égale à la tranche sélectionnée
      if (this.tranchesEgalesDate(this.choix_dateSortie[i], trancheSelectionneeDate)) {
        // Si les tranches sont égales, retourne l'indice de la tranche sélectionnée dans choix_dateSortie
        return i
      }
    }
    // Si la tranche sélectionnée n'est pas trouvée dans choix_dateSortie, retourne -1
    return -1
  }

  //fonction pour vérifier si deux tranches sont égales
  tranchesEgalesDate(tranche1: TrancheDate, tranche2: TrancheDate): boolean {
    // Vérifie si la date de début et la date de fin des deux tranches sont égales
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  //fonction pour vérifier si une tranche est sélectionnée parmi un ensemble de tranches
  isTrancheSelectedDate(tranche: TrancheDate): boolean {
    // Vérifie si au moins une des tranches dans choix_dateSortie a la même date de début et la même date de fin que la tranche donnée en argument
    return this.choix_dateSortie.some(t => t.debut === tranche.debut && t.fin === tranche.fin);
  }


  //fonction pour choisir les tranches de durée
  choisirTrancheDuree(trancheSelectionneeDuree: TrancheDuree): void {
    // Vérifier si la tranche est déjà selectionée
    const index = this.trancheIndexDuree(trancheSelectionneeDuree)
    if (index > -1) {
      // Si la tranche est selectionnée, la retirer du tableau
      this.choix_dureeEp.splice(index, 1)
      this.filters.dureeEpisode.splice(index, 1)
    } else {
      // Sinon on l'ajoute au tableau
      this.choix_dureeEp.push(trancheSelectionneeDuree)
      this.filters.dureeEpisode.push(trancheSelectionneeDuree)
    }
  }

  //fonction pour vérifier si la tranche est déjà selectionée
  trancheIndexDuree(trancheSelectionneeDuree: TrancheDuree): number {
    // Parcours toutes les tranches dans la liste choix_dureeEp
    for (let i = 0; i < this.choix_dureeEp.length; i++) {
      // Vérifie si la tranche actuelle de choix_dureeEp est égale à la tranche selectionée
      if (this.tranchesEgalesDuree(this.choix_dureeEp[i], trancheSelectionneeDuree)) {
        // Si les tranches sont élages, retourne l'indice de la tranche selectionée dans choix_dureeEp
        return i
      }
    }
    // Si la tranche sélectionée n'est pas trouvée dans choix_dureeEp, retourne -1
    return -1
  }

  //fonction pour vérififer si deux tranches sont égales
  tranchesEgalesDuree(tranche1: TrancheDuree, tranche2: TrancheDuree): boolean {
    // Vérifie si la date de début et la date de fin des deux tranches sont égales
    return tranche1.debut === tranche2.debut && tranche1.fin === tranche2.fin
  }

  //fonction pour vérifier si une tranche est sélectionnée parmi un ensemble de tranche
  isTrancheSelectedDuree(tranche: TrancheDuree): boolean {
    //Vérifie si au moins une des tranches dans choix_dureeEp a la même date de début et de fin que la tranche donnée en argument
    return this.choix_dureeEp.some(t => t.debut === tranche.debut && t.fin === tranche.fin)
  }

  // Fonction pour choisir le score
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



  // Tableau pour les genres uniques
  genresUnique: string[] = []

  // Méthode pour extraire les genres uniques
  private extraireGenresUnique() {
    for (let serie of this.series) {
      if (serie.genres && Array.isArray(serie.genres)) {
        for (let genre of serie.genres) {
          // Vérifie si le genre n'est pas déjà dans le tableau genresUnique
          if (!this.genresUnique.includes(genre)) {
            this.genresUnique.push(genre);
          }
        }
      }
    }
  }



  public selectedRandomSerie: any
  // Méthode pour sélectionner la série de manière Aléatoire
  public selectRandomSerie() {
    if (!this.filters.genre || this.filters.genre.length === 0) {
      console.log("Veuillez sélectionner au moins un genre");
      return null;
    }

    // Filtre les séries qui correspondent aux critères
    const seriesFiltrees = this.series.filter((serie: any) => {
      // Vérifie les genres
      const genrePresent = this.filters.genre.some((genre: string) => serie.genres.indexOf(genre) !== -1);

      // Vérifie les tranches de date 
      const dateSortieInclus = this.filters.dateSortie.some((tranche: TrancheDate) => {
        return serie.date_de_sortie >= tranche.debut && serie.date_de_sortie <= tranche.fin;
      })

      // Vérifie les tranches de durée
      const dureeInclus = this.filters.dureeEpisode.some((tranche: TrancheDuree) => {
        return serie.duree_moyenne_episode >= tranche.debut && serie.duree_moyenne_episode <= tranche.fin
      })

      // Vérifie les scores de presse
      const pressScoreInclus = this.filters.pressScore.some((score: number) => {
        return serie.press_score >= score;
      })

      return genrePresent && dateSortieInclus && pressScoreInclus && dureeInclus;
    })

    // Afficher le contenu du tableau filtré
    console.log("Séries filtrées :", seriesFiltrees);

    if (seriesFiltrees.length === 0) {
      console.log("Aucune série trouvée");
      return null;
    }

    // Logique pour sélectionner une série aléatoire
    const randomIndex = Math.floor(Math.random() * seriesFiltrees.length);
    this.selectedRandomSerie = seriesFiltrees[randomIndex];
    console.log("Série sélectionnée aléatoirement :", this.selectedRandomSerie);

    return this.selectedRandomSerie;
  }



  // Mise en place des slides de chxoix
  divVisible: string = "choixGenre" // Initialise la divVisible à choixGenre par défaut

  // Définie la fonction du click qui changera la div visible a la suivante
  suivant() {
    if (this.divVisible === "choixGenre") {
      this.divVisible = "choixDureeEp"
    } else if (this.divVisible === "choixDureeEp") {
      this.divVisible = "dateSortie"
    } else if (this.divVisible === "dateSortie") {
      this.divVisible = "pressScore"
    }else if(this.divVisible === "pressScore"){
    this.selectRandomSerie()
    this.divVisible = "serieAleatoire"
    }
  }
  // Je fais pareil pour un retour en arrière
  retour() {
    if (this.divVisible === "serieAleatoire") {
      this.divVisible = "pressScore"
    } else if (this.divVisible === "pressScore") {
      this.divVisible = "dateSortie"
    } else if (this.divVisible === "dateSortie") {
      this.divVisible = "choixDureeEp"
    }else if(this.divVisible === "choixDureeEp") {
      this.divVisible = "choixGenre"
    }
  }




}
