import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { Question } from '../interfaces/question';
import { Questions } from '../interfaces/questions';
import { Observable } from 'rxjs';
import { MatExpansionPanel } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  public stepOne = "Informações da Avaliação";
  public stepTwo = "Fatores Ambientais";
  public stepThree = "Atividade E Participação";
  public stepFour = "Estruturas Do Corpo";
  public stepFive = "Funções do Corpo";
  
  panelOpenState = false;
  patientCPF: String; 
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  environmentalFactors: Question[];
  activityAndParticipation: Question[];
  bodyStructures: Question[];
  bodyFunctions: Question[];

  @ViewChild("factorPanel") factorPanel:MatExpansionPanel;
  @ViewChild("aNpPanel") aNpPanel:MatExpansionPanel;
  @ViewChild("structurePanel") structurePanel:MatExpansionPanel;
  @ViewChild("functionPanel") functionPanel:MatExpansionPanel;

  constructor(
    private route:Router,
    private _formBuilder: FormBuilder,
    private questionService: QuestionService) {
      this.firstFormGroup = this._formBuilder.group({
        cpf: ['', Validators.required],
        evaluationLocal: ['',Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        evaluationLocal: ['', Validators.required]
      });


      if(this.route.getCurrentNavigation().extras != "undefined" && 
      this.route.getCurrentNavigation().extras.state != null){
        this.firstFormGroup.controls['cpf'].setValue(this.route.getCurrentNavigation().extras.state.patientCpf)
      }
  }

  searchLocal(teste:any){
    console.log(this.firstFormGroup.controls['evaluationLocal'])
    console.log(teste);
  }

  ngOnInit(): void {
    console.log(this.firstFormGroup)
    this.questionService.listQuestions().subscribe(
      res => {
        this.environmentalFactors = res.environmentalFactors;
        this.activityAndParticipation = res.activityAndParticipation;
        this.bodyStructures = res.bodyStructures;
        this.bodyFunctions = res.bodyFunctions;
      },
      err => {
        console.log(err);
      }
    );
  }


}
