import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private session:SessionService, private router:Router){}

  ngOnInit(){
    console.log(this.session.getUserLogged());
    if(this.session.getUserLogged() == null){
      this.router.navigate(['']);
    }else if(localStorage.getItem('role') == 'PATIENT'){
      this.router.navigate(['evaluations'])
    }
  }
}
