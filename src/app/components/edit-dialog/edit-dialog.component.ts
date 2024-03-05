import { NgIf } from '@angular/common';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    MatDialogClose,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {
  @Output() userInfoUpdated: EventEmitter<void> = new EventEmitter<void>

  isPasswordField: boolean = false
  newValue: string = ''
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { field: string },
  ) {
    // Vérifier si le champ actuel est destiné au mot de passe
    this.isPasswordField = data.field === 'password';
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }

  onSave(): void {
    if (this.isPasswordField) {
      // Gérer la sauvegarde du mot de passe
      if (this.newPassword !== this.confirmPassword) {
        console.log("Les mots de passe doivent être identiques")
        return
      }
      this.dialogRef.close({ oldPassword: this.oldPassword, newPassword: this.newPassword })
    } else {
      // Émettre l'évènement pour indiquer que les information sont à jour
      this.userInfoUpdated.emit()
      // Gérer la sauvegarde du username
      this.dialogRef.close(this.newValue)
    }


  }
}
