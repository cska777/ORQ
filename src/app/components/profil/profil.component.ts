import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { UserService } from '../../user.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  userInfo: any
  newUsername: string = ""
  newPassword: string = ""
  confirmNewPassword: string = ""
  isPopUpOpen: boolean = false
  errorMessage: string = ""
  errorMessageMdp: string = ""
  oldPassword: string = ""

  constructor(private router: Router, private apiService: ApiService, private userService: UserService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("token")
    if (!token) {
      this.router.navigate(['/'])
    }

    this.userService.loadUserInfo()
    this.userInfo = this.userService.getUserInfo()
  }


  updateUsername(newUsername: string): void {
    if(newUsername.trim() === "" || newUsername.includes(" ")){
      this.errorMessage = "Le nouveau nom d'utilisateur ne peut pas être vide ou contenir des espaces"
      return
    }

    if (newUsername === this.userInfo.username) {
      this.errorMessage = "Le nouveau nom d'utilistateur doit être différent de l'actuel."
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      console.log("Token d'identification introuvable")
      return
    }
    // Mise à jour du nom d'utilisateur via le service API
    this.apiService.updateUser(newUsername, token).subscribe({
      next: (response: any) => {
        console.log("Username modifié avec succès", response)
        this.userInfo.username = newUsername
      },
      error: (error: any) => {
        console.error("Erreur lors du changement de Username", error)
      }
    })
  }

  changePassword(newPassword: string, oldPassword: string): void {
    if(newPassword.length < 8){
      this.errorMessageMdp = "Le mot de passe doit contenir au moins 8 carractères"
      return
    }
    if (newPassword !== this.confirmNewPassword) {
      this.errorMessageMdp = "Les mots de ne correspondent pas"
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      console.log("Token d'indentification introuvable")
      return
    }
    // Vérification de si l'ancien mot de passe via l'API
    this.apiService.checkPassword(oldPassword, token).subscribe({
      next: (response: any) => {
        // Changement du mot de passe via le service API
        this.apiService.changePassword(oldPassword, newPassword, token).subscribe({
          next: (response: any) => {
            console.log("Mot de passe changé avec succès :", response)
          },
          error: (error: any) => {
            console.error("Erreur lors du changement de mot de passe :", error)
          }
        })
      },
      error:(error:any) => {
        console.error("Erreur lors de la vérification de l'ancien mot de passe", error)
        this.errorMessageMdp = "Ancien mot de passe incorrect"
      }
    })
  }
}
