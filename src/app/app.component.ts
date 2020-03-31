import { Component, OnChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SessionService } from './service/session.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnChanges {
  title = 'aplicacao-cif-mackenzie';
  public greetings: string;
  private hours: number;
  public isLogged: boolean;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private route: Router, private sessionService: SessionService, private breakpointObserver: BreakpointObserver) {
    iconRegistry.addSvgIcon(
      'mack_white',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/icons/mack_white.svg')
    );
  }
  onActivate(componentReference) {
    console.log(componentReference)
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.isLogged = this.islogged();
    this.greetings = this.setGreetigns();
  }

  ngOnInit() {
    this.isLogged = this.islogged();
    this.greetings = this.setGreetigns();
    console.log(this.greetings);
    if (this.sessionService.getUserLogged() == null) {
      return this.route.navigate(['']);
    }
  }

  islogged() {
    if (this.sessionService.getUserLogged() != null) {
      return true;
    }
    return false;
  }

  setGreetigns() {
    this.hours = new Date().getHours();
    console.log(this.hours);
    if (this.hours >= 3 && this.hours < 12) {
      console.log('Dia.. ' + this.hours);
      return "Bom Dia, " + localStorage.name + "!";
    }

    if (this.hours >= 12 && this.hours < 18) {
      console.log('Tarde.. ' + this.hours);
      return "Boa Tarde, " + localStorage.name + "!";
    }

    if (this.hours >= 18 || this.hours < 3) {
      console.log('Notie.. ' + this.hours);
      return "Boa Notie, " + localStorage.name + "!";
    }
    console.log('nao caiu em nada')
  }

  viewProfile() {

  }


  logout() {
    this.sessionService.logoutUser();
    location.reload();
    this.route.navigate(['']);
  }

  redirectToPatientRegister() {
    this.route.navigate(['patientRegister']);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}