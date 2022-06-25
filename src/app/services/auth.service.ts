import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoggedIn = true;

  constructor() {

  }

  isAuthenticated(): boolean {
    return this.userLoggedIn;
  }

  authinticateUser() {
    this.userLoggedIn = true;
  }
}
