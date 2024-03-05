import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { ApiService } from '../../api.service';
import { UserService } from '../../user.service';

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

  constructor(private router: Router, public dialog: MatDialog, private apiService: ApiService, private userService:UserService) { }

  ngOnInit(): void {
    const token = localStorage.getItem("token")
    if (!token) {
      this.router.navigate(['/'])
    }

    this.userService.loadUserInfo()
    this.userInfo = this.userService.getUserInfo()
  }


  openEdit(field: string): void {
    this.isPopUpOpen = true;
    const dialogRef: MatDialogRef<EditDialogComponent> = this.dialog.open(EditDialogComponent, {
      width: '250px',
      height: '400px',
      data: { field }
    });

    dialogRef.componentInstance.userInfoUpdated.subscribe(() => {
      this.userService.updateUsername(this.newUsername)
      // Charger à nouveau les informations utilisateur après la mise à jour
      this.userService.loadUserInfo()
    })

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
    const token = localStorage.getItem("token")
    if(!token){
      console.log("Token d'indentification introuvable")
      return
    }
    // Changement du mot de passe via le service API
    this.apiService.changePassword(newPassword,oldPassword,token).subscribe({
      next :(response:any) => {
        console.log("Mot de passe changé avec succès :", response)
      },
      error: (error:any) => {
        console.error("Erreur lors du changement de mot de passe :", error)
      }
    })
  }
}
