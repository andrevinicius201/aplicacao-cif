import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }

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
    return this.http.get<Patient>(url, httpOptions);
  }
}
