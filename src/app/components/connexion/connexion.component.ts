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
    FormsModule
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
          // Rediriger vers la page d'accueil ou une autre page après la connexion réussie
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.log('Connexion échouée', error);
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }

  login(username: string, password: string): Observable<any> {
    const loginUrl = 'http://localhost:8000/api-user-login/';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(loginUrl, { username, password }, { headers });
  }

}
