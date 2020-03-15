import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material';
import { SessionService } from '../service/session.service';
import { Person } from '../interfaces/person';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  callRegisterComponent = false;
  loading = false

  @Input() person: Person = <Person>{};
  @Output() id: EventEmitter<string> = new EventEmitter();
  constructor(private authService: AuthService ,private router: Router, private snackbar: MatSnackBar,  private sessionService: SessionService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    if( this.person.email.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') ) {
      this.authService.patientLogin(this.person.email, this.person.password)
      .subscribe(
        res => {
          this.loading = false;
          this.sessionService.saveUserLoggedId(res.id)
          console.log('successful login!');
          this.router.navigate(['home']);
        }, error => {
          this.loading = false;
          console.log(error);
          this.snackbar.open('Email ou Senha incorreto!', 'Dismiss', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  toRegister(){
    this.router.navigateByUrl('/register');
  }
}
