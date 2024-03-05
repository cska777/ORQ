import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [
    RouterLink,
    NgIf,
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private http: HttpClient, private userService: UserService) { }

  isUserLoggedIn = false
  userInfo: any

  ngOnInit(): void {
    this.loadUserInfo()
  }

  loadUserInfo(): void {
    this.userService.loadUserInfo()

    const token = localStorage.getItem("token")
    if (!token) {
      console.log("Aucun token trouvé")
    } else {
      this.isUserLoggedIn = true
    }

    this.updateUserInfo()
  }

  updateUserInfo(): void {
    this.userInfo = this.userService.getUserInfo()
  }

  onLogout(): void {
    localStorage.clear()
    window.location.reload()
  }


}
