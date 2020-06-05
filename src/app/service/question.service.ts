import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Questions } from '../interfaces/questions';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }
  
  listQuestions(): Observable<Questions>{
    const url = `${environment.questionBaseUrl}/v1/questions`;
    return this.http.get<Questions>(url);
  }
}
