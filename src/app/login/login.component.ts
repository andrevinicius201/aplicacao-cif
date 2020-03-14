import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  callRegisterComponent = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  toRegister(){
    this.router.navigateByUrl('/register');
  }
}
