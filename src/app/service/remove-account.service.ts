import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class RemoveAccountService {

  constructor(private http: HttpClient, private session: SessionService) { }

  removeAccount(id:String): Observable<{}> {
    const url = `${environment.personBaseUrl}/v1/person/delete/${id}`;
    return this.http.delete(url);
  }

}
