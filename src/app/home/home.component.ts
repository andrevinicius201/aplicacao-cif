import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public greetings:string;
  private hours: number;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private route:Router, private sessionService:SessionService, private breakpointObserver: BreakpointObserver) {
      iconRegistry.addSvgIcon(
        'mack_white',
        sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/mack_white.svg')
      );
  }

  ngOnInit(){
    this.greetings = this.setGreetigns();
    if(this.sessionService.getUserLogged() == null){
      return this.route.navigate(['']);
    }
  }

  setGreetigns(){
    this.hours = new Date().getHours();
    console.log(this.hours);
    if(this.hours >= 3 && this.hours < 12){
      return "Bom Dia, " + localStorage.name+"!";
    }

    if(this.hours >= 12 && this.hours < 18){
      return "Boa Tarde, " + localStorage.name+"!";
    }

    if(this.hours >= 18 && this.hours < 3){
      return "Boa Notie, " + localStorage.name+"!";
    }

  }

  viewProfile(){

  }

  logout(){
    this.sessionService.logoutUser();
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  

}
