import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-oeuvre-details',
  standalone: true,
  imports: [
    NgIf,
    NgFor
  ],
  templateUrl: './oeuvre-details.component.html',
  styleUrl: './oeuvre-details.component.css'
})
export class OeuvreDetailsComponent {
  oeuvre : any
  constructor(public dialogRef:MatDialogRef<OeuvreDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data:any){
    this.oeuvre = data.oeuvre
    console.log(this.oeuvre.genres)
  }

}
