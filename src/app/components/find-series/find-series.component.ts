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

@Component({
  selector: 'app-find-series',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './find-series.component.html',
  styleUrl: './find-series.component.css'
})
export class FindSeriesComponent {

  constructor() {
    // Appel de la méthode pour extraire les genres uniques
    this.extraireGenresUnique()
    this.selectRandomSerie()

  }

  // Tableau pour stocker les choix et filtré
  filters: any = {
    genre: [],
    dateSortie: [],
    pressScore: []
  }

  //tableau pour récupérer le choix des genres
  choix_genre: string[] = []

  //tableau pour récuéprer le choix de date
  choix_dateSortie: TrancheDate[] = []

  //tableau pour récupérer le choix de note
  choix_score: number[] = []

  // tableau pour les mots clés
  mots_clefs: string[] = []

  // Je stocke les informations de mon fichier json dans une variable
  // pour pouvoir l'utiliser dans ma vue
  series: any = jsonData

  // Tableua pour les séries filtrée
  seriesFiltrees: any[] = []



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
    console.log("Genre sélectionnée : ", this.choix_genre)
    console.log("Filtres : ", this.filters)
  }

  //fonction pour choisir les tranches de date
  choisirTrancheDate(trancheSelectionnee: TrancheDate): void {
    // Vérifier si la tranche est déjà slectionné
    const index = this.tranchesIndex(trancheSelectionnee)
    if (index > -1) {
      // Si la tranche est selectionnée, le retirer du tableau
      this.choix_dateSortie.splice(index, 1)
      this.filters.dateSortie.splice(index, 1)
    } else {
      // Sinon l'ajouter au tableau
      this.choix_dateSortie.push(trancheSelectionnee)
      this.filters.dateSortie.push(trancheSelectionnee)
    }
    console.log("Tranche selectionnee : ", this.choix_dateSortie)
    console.log("Filtres : ", this.filters)

  }

  // fonction pour vérifier si la tranche est déjà selectionnée
  tranchesIndex(trancheSelectionnee: TrancheDate): number {
    for (let i = 0; i < this.choix_dateSortie.length; i++) {
      if (this.tranchesEgales(this.choix_dateSortie[i], trancheSelectionnee)) {
        return i
      }
    }
    return -1
  }

  // Fonction pour vérifier si deux tranches sont égales
  tranchesEgales(tranche1: TrancheDate, tranches2: TrancheDate): boolean {
    return tranche1.debut === tranches2.debut && tranche1.fin === tranches2.fin
  }

  isTrancheSelected(tranche: TrancheDate): boolean {
    return this.choix_dateSortie.some(t => t.debut === tranche.debut && t.fin === tranche.fin);
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
    console.log("Score selectionné : ", this.choix_score)
    console.log("Filtres : ", this.filters)
  }



  // Tableau pour les genres uniques
  genresUnique: string[] = []

  // Méthode pour extraire les genres uniques
  private extraireGenresUnique() {
    for (let serie of this.series) {
      for (let genre of serie.genres) {
        // Verification de si le genre n'est pas dégjà dans le tableau genresUnique
        if (!this.genresUnique.includes(genre)) (
          this.genresUnique.push(genre)
        )
      }
    }
  }

  public selectedRandomSerie: any
  // Méthode pour sélectionner la série de manière Aléatoire
  public selectRandomSerie() {
    if(!this.filters.genre || this.filters.genre.length === 0){
      console.log("Veuillez au moins un genre")
      return
    }
    // Filtre les séries qui correspondent aux critères
    const seriesFiltrees = this.series.filter((serie: any) => {
      // Vérifie les genres
      const genresInclus = this.filters.genre.every((genre: any) => serie.genre.includes(genre))

      // Vérifie les tranches de date 
      const dateSortieInclus = this.filters.dateSortie.some((tranche: any) => {
        serie.date_de_sortie >= tranche.debut && serie.date_sortie <= tranche.fin
      })

      // Vérifie les scores de presse
      const pressScoreInclus = this.filters.pressScore.some((score: any) => serie.press_score >= score)

      return genresInclus && dateSortieInclus && pressScoreInclus
    })

    if (seriesFiltrees.length === 0) {
      console.log("Aucune série trouvée")
      return []
    }
    // Logique pour sélectionner une série aléatoire
    const randomIndex = Math.floor(Math.random() * seriesFiltrees.length)
    this.selectedRandomSerie = seriesFiltrees[randomIndex]
    console.log("Série selectionnée alétoirement :" , this.selectedRandomSerie)

    return this.selectRandomSerie = seriesFiltrees[randomIndex]
  }


  choixSeries = new FormControl("")



}
