import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userName: String;
  password: String;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  login() {
    this.authService.authinticateUser();
    this.router.navigateByUrl('/search');
  }
}
