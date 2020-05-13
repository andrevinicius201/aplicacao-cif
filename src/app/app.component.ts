import { Component, OnChanges, Injectable, ɵConsole, ViewChild, ElementRef } from '@angular/core';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { SessionService } from './service/session.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent implements OnChanges {
  title = 'aplicacao-cif-mackenzie';

  public greetings: string;
  private hours: number;
  public role: string;
  public isLogged: boolean;
  public openMenu: boolean;
  
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private route: Router, private sessionService: SessionService, private breakpointObserver: BreakpointObserver) {
    iconRegistry.addSvgIcon(
      'mack_white',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/mack_white.svg')
    );
  }

  @ViewChild('drawer') drawerElement: MatSidenav;

  onActivate(componentReference) {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.isLogged = this.islogged();
    this.greetings = this.setGreetigns();
    this.role = localStorage.getItem('role');
  }

  ngOnInit() {
    this.isLogged = this.islogged();
    this.greetings = this.setGreetigns();
    this.role = localStorage.getItem('role');
    if (this.sessionService.getUserLogged() == null) {
      return this.route.navigate(['']);
    }
  }

  openSideMenu(){
    if(this.drawerElement != undefined){
      this.drawerElement.open();
    }
  }

  islogged() {
    if (this.sessionService.getUserLogged() != null) {
      return true;
    }
    return false;
  }

  goHome(){
    if(localStorage.getItem('role') == 'PATIENT'){
      this.route.navigateByUrl('evaluations');
    }else{
      this.route.navigateByUrl('home');
    }
  }

  setGreetigns() {
    this.hours = new Date().getHours();
    if (this.hours >= 3 && this.hours < 12) {
      return "Bom Dia, " + localStorage.name + "!";
    }
    if (this.hours >= 12 && this.hours < 18) {
      return "Boa Tarde, " + localStorage.name + "!";
    }
    if (this.hours >= 18 || this.hours < 3) {
      return "Boa Noite, " + localStorage.name + "!";
    }

  }

  viewProfile() {
    this.route.navigate(['editProfile']);
  }

  logout() {
    this.sessionService.logoutUser();
    location.reload();
    this.route.navigate(['']);
  }

  redirectToPatientRegister() {
    this.route.navigate(['patientRegister']);
  }

  redirectToEvaluation() {
    this.route.navigate(['evaluation']);
  }

  redirectToPatientList(){
    this.route.navigate(['patientList']);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}