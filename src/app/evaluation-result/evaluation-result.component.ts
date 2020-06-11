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
  public evaluation:any;
  public questions:Questions;
  private evaluation_id:string = "";

  constructor(private evaluationService:EvaluationService, private questionService:QuestionService) { }

  ngOnInit(): void {
    this.evaluation_id = location.href.substring(location.href.lastIndexOf('/') + 1);
    this.questionService.listQuestions()
    .subscribe(
      data => {
        this.questions = data;
      }
    );  
    this.evaluationService.getEvaluation(this.evaluation_id)
    .subscribe(
      data => {
        this.evaluation = data;
      }
    );  
  }

  getQuestion(answer:Answer){
    if(this.questions!= undefined){
      var question =  this.questions.environmentalFactors.find(i => i.id == answer.questionId);
      return question ;
    }
  }


  getAnswerGrade(question:Question){
    var array = this.evaluation.answers;
    if(array != undefined){
      var answer =  array.find(i => i.questionId == question.id);
      return answer;
    }
  }

  
}
