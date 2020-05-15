import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { Question } from '../interfaces/question';
import { Questions } from '../interfaces/questions';
import { Observable } from 'rxjs';
import { MatExpansionPanel } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Patient } from '../interfaces/patient';
import { Person } from '../interfaces/person';
import { PatientListService } from '../service/patient-list.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  stepOne = "Informações da Avaliação";
  stepTwo = "Fatores Ambientais";
  stepThree = "Atividade E Participação";
  stepFour = "Estruturas Do Corpo";
  stepFive = "Funções do Corpo";
  
  loading: boolean;
  panelOpenState = false;
  patient: Person; 

  public patients: Person[];
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
    private questionService: QuestionService,
    private patientService: PatientListService) {
      this.firstFormGroup = this._formBuilder.group({
        cpf: ['', Validators.required],
        evaluationLocal: ['',Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        evaluationLocal: ['', Validators.required]
      });


      if(this.route.getCurrentNavigation().extras != "undefined" && 
      this.route.getCurrentNavigation().extras.state != null){
        console.log("PATIENT",this.route.getCurrentNavigation().extras.state.patient);
        this.patient = this.route.getCurrentNavigation().extras.state.patient;
        this.firstFormGroup.controls['cpf'].setValue(this.patient.id);
      }
  }

  searchLocal(teste:any){
    console.log(this.firstFormGroup.controls['evaluationLocal'])
    console.log(teste);
  }

  ngOnInit(): void {
    console.log(this.firstFormGroup)
    this.listQuestions();
    this.listPatients();
  }

  private listQuestions(){
    this.loading = true;
    this.questionService.listQuestions().subscribe(
      res => {
        this.loading = false;
        this.environmentalFactors = res.environmentalFactors;
        this.activityAndParticipation = res.activityAndParticipation;
        this.bodyStructures = res.bodyStructures;
        this.bodyFunctions = res.bodyFunctions;
      },
      err => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  private listPatients(){
    this.patientService.getPatientList()
    .subscribe(
      data => {
        console.log(data);
        this.patients = data;
      },
      err => {
        console.log(err);
      }
    )
  }
}
