import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, ObservedValueOf } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person } from '../interfaces/person';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient, private session:SessionService) { }

  login(login: string, password: string) : Observable<any> {
    const url = `${environment.personBaseUrl}/v1/person/login`;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token',
        'userLogin': login,
        'password': password
      })
    };
    return this.http.get<Person>(url, httpOptions);
  }

  forgotPassword(cpf:string) : Observable<any> {
    const url = `${environment.personBaseUrl}/v1/person/forgotPassword/${cpf}`;
    return this.http.get<any>(url);
  }

  getUserData(login: string) : Observable<any> {
    const url = `${environment.personBaseUrl}/v1/person/findById/${this.session.userId}`;
    return this.http.get<Person>(url);
  }
}
