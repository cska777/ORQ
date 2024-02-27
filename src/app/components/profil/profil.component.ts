import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  userInfo: any

  newUsername: string = ""
  newPassword: string = ""
  isPopUpOpen: boolean = false

  constructor(private router: Router, public dialog: MatDialog, private apiService: ApiService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("token")
    if (!token) {
      this.router.navigate(['/'])
    }

    const userString = localStorage.getItem("user")
    if (userString) {
      this.userInfo = JSON.parse(userString)
    }

  }


  openEdit(field: string): void {
    this.isPopUpOpen = true;
    const dialogRef: MatDialogRef<EditDialogComponent> = this.dialog.open(EditDialogComponent, {
      width: '250px',
      height: '400px',
      data: { field }
    });

    dialogRef.afterClosed().subscribe((result: {oldPassword: string, newPassword:string} | null ) => {
      if(result){
        if(field === 'password'){
          this.changePassword(result.oldPassword, result.newPassword)
        } else if(field === 'username')
        this.updateUsername(result as unknown as string)

      }
    });
  }

  updateUsername(newUsername:string):void{
    const token = localStorage.getItem("token")
    if(!token){
      console.log("Token d'identification introuvable")
      return
    }
    // Mise à jour du nom d'utilisateur via le service API
    this.apiService.updateUser(newUsername,token).subscribe({
      next:(response:any) => {
        console.log("Username modifié avec succès", response)
        this.userInfo.username = newUsername
      },
      error:(error:any) => {
        console.error("Erreur lors du changement de Username", error)
      }
    })
  }

  changePassword(newPassword:string, oldPassword:string):void{
    // Changement du mot de passe via le service API
    this.apiService.changePassword(newPassword,oldPassword).subscribe({
      next :(response:any) => {
        console.log("Mot de passe changé avec succès :", response)
      },
      error: (error:any) => {
        console.error("Erreur lors du changement de mot de passe :", error)
      }
    })
  }
}
