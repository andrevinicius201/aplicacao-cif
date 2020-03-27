import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class SessionService {
  public userId: string;


  constructor(private route: Router) { }

  getUserLogged() {
    const userId = localStorage.getItem('user');
    if (!this.userId) {
      this.userId = userId;
    }
    return this.userId;
  }

  saveUserLoggedId(userId: string) {
    localStorage.setItem('user', userId);
    this.userId = userId;
  }

  logoutUser() {
    localStorage.removeItem('user');
    this.userId = '';
    this.route.navigate(['']);
  }
}
