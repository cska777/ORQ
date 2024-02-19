import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn : 'root'
})

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [
    NgIf,
    HttpClientModule,
    FormsModule,
  ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.username && this.password) {
      this.login(this.username, this.password).subscribe({
        next: (response: any) => {
          console.log('Connexion réussie', response);
          if (response && response.token && response.user) {
            localStorage.setItem('token', response.token); // Stockage du token dans le localStorage
            localStorage.setItem('user', JSON.stringify(response.user)); // Stockage des informations de l'utilisateur dans le localStorage
            // Vérifier si le token a été correctement stocké
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
              console.log('Token stocké avec succès dans le local storage:', storedToken);
            } else {
              console.error('Erreur lors de la récupération du token depuis le local storage.');
            }
            // Rediriger vers la page d'accueil ou une autre page après la connexion réussie
            this.router.navigate(['/']);
          } else {
            console.log("Token d'authentification ou informations utilisateur manquants dans la réponse.");
          }
        },
        error: (error: any) => {
          console.log('Connexion échouée', error);
          this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
        }
      });
    } else {
      this.errorMessage = "Veuillez remplir tous les champs.";
    }
  }

  login(username: string, password: string): Observable<any> {
    const loginUrl = 'http://localhost:8000/login/';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(loginUrl, { username, password }, { headers });
  }

  getLoggedInUserInfo() {
    // Appel à la méthode pour récupérer les informations de l'utilisateur
    // Utilisez le token d'authentification pour appeler votre API
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
      this.http.get<any>('http://localhost:8000/test_token/', { headers }).subscribe({
        next: (response: any) => {
          console.log('Informations utilisateur:', response);
          // Vous pouvez traiter les informations utilisateur ici, les afficher dans le composant, etc.
        },
        error: (error: any) => {
          console.log('Erreur lors de la récupération des informations utilisateur', error);
        }
      });
    } else {
      console.log("Aucun token d'authentification trouvé.");
    }
  }

  ngOnInit(): void{
    const token = localStorage.getItem("token")
    if(token){
      this.router.navigate(['/'])
    }
  }
}
