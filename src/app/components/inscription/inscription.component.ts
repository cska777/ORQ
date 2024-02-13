import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgFor,
    NgIf,
    NgClass
  ],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  userData: any = {};
  errors: string[] = [];
  success: string[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit(): void {
    this.errors = [];
    if (this.userData.username && this.userData.email && this.userData.password && this.userData.passwordConfirm && this.userData.password === this.userData.passwordConfirm) {
      const apiUrl = 'http://localhost:8000/signup/';
      this.http.post<any>(apiUrl, this.userData).subscribe({
        next: (response: any) => {
          console.log("Enregistrement effectué avec succès", response);
          this.success.push("Compte créé avec succès", response.message);
          this.router.navigate(['/connexion']);
        },
        error: (error: any) => {
          console.error("Échec de l'enregistrement", error);
          this.errors.push("Échec lors de l'enregistrement : ", error.message);
        }
      });
    } else {
      console.error("Veuillez remplir tous les champs obligatoires.");
      this.errors.push("Veuillez remplir tous les champs obligatoires");
    }
  }
}
