import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  userData : any = {}

  constructor(private http: HttpClient) {}

  onSubmit(): void {
    // Deboggage des valeurs des champs juste avant l'envoi à l'API Django
    console.log('Valeur du champ username:', this.userData.username);
    console.log('Valeur du champ email:', this.userData.email);
    console.log('Valeur du champ password:', this.userData.password);
    console.log('Valeur du champ firstname:', this.userData.first_name);
    console.log('Valeur du champ lastname:', this.userData.last_name);

    // Vérifier si les champs requis sont renseignés
    if (this.userData.username && this.userData.email && this.userData.password) {
      // Définir l'URL de l'API à laquelle envoyer les données
      const apiUrl = 'http://localhost:8000/api/v1/users/';

      // Utiliser HTTPClient pour envoyer une requête POST avec les données utilisateur
      this.http.post(apiUrl, this.userData).subscribe({
        next: (response: any) => {
          console.log("Enregistrement effectué avec succès", response);
          // Réinitialiser les champs du formulaire après l'enregistrement réussi
          this.userData = {
            username: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            
          };
      
        },
        error: (error: any) => {
          console.error("Échec de l'enregistrement", error);
        }
      });
    } else {
      console.error("Veuillez remplir tous les champs obligatoires.");
    }
  }
}
