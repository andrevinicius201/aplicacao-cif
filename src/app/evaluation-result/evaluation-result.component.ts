import { Component, OnInit } from '@angular/core';
import { EvaluationService } from '../service/evaluation.service';
import { Answer } from '../interfaces/answer';
import { Question } from '../interfaces/question';
import { Questions } from '../interfaces/questions';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-evaluation-result',
  templateUrl: './evaluation-result.component.html',
  styleUrls: ['./evaluation-result.component.css']
})
export class EvaluationResultComponent implements OnInit {
  private evaluationId:string = "";
  public evaluation:any;
  

  constructor(private evaluationService:EvaluationService) { }

  ngOnInit(): void {
    this.evaluationId = location.href.substring(location.href.lastIndexOf('/') + 1);
    this.evaluationService.getEvaluation(this.evaluationId)
    .subscribe(
      data => {
        this.evaluation = data;
      }
    );  
  }
  
}
