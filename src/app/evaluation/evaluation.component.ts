import { Component, OnInit, ViewChild, Input, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { Question } from '../interfaces/question';
import { Questions } from '../interfaces/questions';
import { Observable } from 'rxjs';
import { MatExpansionPanel, MatSnackBar } from '@angular/material';
import { Person } from '../interfaces/person';
import { PatientListService } from '../service/patient-list.service';
import { Evaluation } from '../interfaces/evaluation';
import { Answer } from '../interfaces/answer';
import { EvaluationService } from '../service/evaluation.service';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
declare var xepOnline: any;

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  public months: {[key: number]: string} = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10:"Outubro",
    11:"Novembro",
    12:"Dezembro"
  }

  stepOne = "Informações da Avaliação";
  stepTwo = "Fatores Ambientais";
  stepThree = "Atividade E Participação";
  stepFour = "Estruturas Do Corpo";
  stepFive = "Funções do Corpo";

  loaded: boolean = false;
  loading: boolean;
  patient: Person;

  public patients: Person[];
  secondFormGroup: FormGroup;
  invalids: string[] = [];

  ieFormGroup: FormGroup;
  efFormGroup: FormGroup;
  apFormGroup: FormGroup;
  bsFormGroup: FormGroup;
  bfFormGroup: FormGroup;

  environmentalFactors: Question[];
  activityAndParticipation: Question[];
  bodyStructures: Question[];
  bodyFunctions: Question[];

  @Input() evaluation: Evaluation = <Evaluation>{};
  @Input() answer: Answer = <Answer>{};


  @ViewChild("factorPanel") factorPanel: MatExpansionPanel;
  @ViewChild("aNpPanel") aNpPanel: MatExpansionPanel;
  @ViewChild("structurePanel") structurePanel: MatExpansionPanel;
  @ViewChild("functionPanel") functionPanel: MatExpansionPanel;
  @ViewChild("invalid") invalid: ElementRef;
  @ViewChild("print") print: ElementRef;

  questions: Observable<Questions>;
  questionList: Questions;

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    private questionService: QuestionService,
    private patientService: PatientListService,
    private evaluationService:EvaluationService,
    private snackbar: MatSnackBar) {
    if (this.route.getCurrentNavigation().extras != "undefined" &&
      this.route.getCurrentNavigation().extras.state != null) {
      this.patient = this.route.getCurrentNavigation().extras.state.patient;
      this.ieFormGroup = this.createieFormGroup();
      this.ieFormGroup.controls['patientId'].setValue(this.patient.id);
    } else {
      this.ieFormGroup = this.createieFormGroup();
    }
  }

  ngOnInit(): void {
    this.questionService.listQuestions().subscribe(
      data => {
        

        this.environmentalFactors = data.environmentalFactors;
        this.efFormGroup = this.createefFormGroup(data);
        this.setQuestionsIdAndValidations(this.efFormGroup, data.environmentalFactors);

        this.activityAndParticipation = data.activityAndParticipation;
        this.apFormGroup = this.createapFormGroup(data);
        this.setQuestionsIdAndValidations(this.apFormGroup, data.activityAndParticipation);

        this.bodyStructures = data.bodyStructures;
        this.bsFormGroup = this.createbsFormGroup(data);
        this.setQuestionsIdAndValidations(this.bsFormGroup, data.bodyStructures);

        this.bodyFunctions = data.bodyFunctions;
        this.bfFormGroup = this.createbfFormGroup(data);
        this.setQuestionsIdAndValidations(this.bfFormGroup, data.bodyFunctions);
        this.loaded = true;


      }
    );
    this.listPatients();
  }

  dateConversion(date:string){
    let str = date; 
    let splitted = str.split("-", 3); 
    let day = splitted[2].substring(0,2);
    let month = splitted[1];
    let year = splitted[0];
    return day + " de " + this.months[parseInt(month)] + " de " + year;
  } 
  
  setQuestionsIdAndValidations(fg: FormGroup, list: any[]) {
    for (let index = 0; index < list.length; index++) {
      fg.controls.questionId.get([index]).setValue(list[index].id);
      fg.controls.infoSource.get([index]).setValidators(Validators.required);
      if (fg.controls.generalGrade != undefined) {
        console.log("generalGrade setado")
        fg.controls.generalGrade.get([index]).setValidators(Validators.required);
      }
      else if (fg.controls.capacityGrade != undefined) {
        fg.controls.capacityGrade.get([index]).setValidators(Validators.required);
        fg.controls.performanceGrade.get([index]).setValidators(Validators.required);
      }
      else {
        fg.controls.locationGrade.get([index]).setValidators(Validators.required);
        fg.controls.natureGrade.get([index]).setValidators(Validators.required);
        fg.controls.extensionGrade.get([index]).setValidators(Validators.required);
      }
    }
  }

  download(){
    var file = "Avaliação Funcional - " + this.evaluation.patientId;
    //this.newEvaluation();
    return xepOnline.Formatter.Format('print', {render:'download', filename: file});
  }
  
  public openPDF():void {
    let doc = new jsPDF('p','pt', 'a4');
    // TITLE
    doc.setFontType("bold")
    doc.setFontSize(24);
    doc.setFont("Roboto");
    doc.text("Relatório de Classificação Funcional", 120,40);
    doc.line(10,55,585,55);
    // TITLE END

    // HEADER
    doc.setFontSize(16);
    doc.text("Paciente: ",20,80);
    doc.setFontType("normal");
    doc.text(this.findName(this.evaluation.patientId),90,80);

    doc.setFontType("bold");
    doc.setFontSize(16);
    doc.text("Data: ",350,80);
    doc.setFontType("normal");
    doc.text(this.dateConversion(this.evaluation.date),390,80);

    doc.setFontType("bold");
    doc.setFontSize(16);
    doc.text("Terapeuta: ",20,110);
    doc.setFontType("normal");
    doc.text(localStorage.getItem("name"),100,110);

    doc.setFontType("bold");
    doc.setFontSize(16);
    doc.text("Local: ",350,110);
    doc.setFontType("normal");
    doc.text(this.evaluation.location,395,110);

    doc.line(10,120,585,120);

    doc.autoTable({
      head: [['Name', 'Email', 'Country']],
      body: [
        ['David', 'david@example.com', 'Sweden'],
        ['Castille', 'castille@example.com', 'Norway']
      ],
    });

    doc.save('asassa.pdf');
  }

  findName(id:String){
    var item = this.patients.find(i => i.id == id);
    return item != undefined ? item.firstName+" "+item.lastName : null;
  }
  

  newEvaluation(){
    this.loading = true;
    this.evaluationService.newEvaluation(this.evaluation).subscribe(
      () =>{
      this.loading = false;
      this.snackbar.open('Avaliação salva com sucesso!', 'Accept', {
        duration: 2000,
        panelClass: ['green-snackbar']
      });
      this.route.navigate(['home']);
    },
    () =>{
      this.loading = false;
      this.snackbar.open('Erro ao salvar avaliação!', 'Accept', {
        duration: 2000,
        panelClass: ['green-snackbar']
      });
    }
    )
  }

  addIEtoBounderObject() {
    this.evaluation = this.ieFormGroup.value;
    this.evaluation.therapistId = localStorage.getItem("user");
    this.evaluation.date = new Date().toISOString();
    this.evaluation.answers = [];
    console.log(this.evaluation)
  }

  getQuestionCode(answer:Answer, array:any[]){
    var item = array.find(i => i.id == answer.questionId);
    return item != undefined ? item.code : null;
  }

  getAnswerGrade(question:Question){
    var array = this.evaluation.answers;
    if(array != undefined){
      var answer =  array.find(i => i.questionId == question.id);
      return answer;
    }
  }

  getQuestionTitle(answer:Answer, array:any[]){
    var item = array.find(i => i.id == answer.questionId);
    return item != undefined ? item.title : null;
  }

  addAnswers(fg: FormGroup) {
    this.invalids = [];
    const list = fg.get('questionId').value;
    for (let i = 0; i < list.length; i++) {
      if(this.evaluation.answers.find(a => a.questionId == list[i]) != null){
       break; 
      }
      let answer: Answer = {
        questionId: fg.get('questionId').value[i],
        infoSource: fg.get('infoSource').value[i],
        problemDescription: fg.get('problemDescription').value[i],

        generalGrade: fg.get('generalGrade') == undefined || null
          ? null
          : fg.get('generalGrade').value[i],

        performanceGrade: fg.get('performanceGrade') == undefined || null
          ? null
          : fg.get('performanceGrade').value[i],

        capacityGrade: fg.get('capacityGrade') == undefined || null
          ? null
          : fg.get('capacityGrade').value[i],

        natureGrade: fg.get('natureGrade') == undefined || null
          ? null
          : fg.get('natureGrade').value[i],

        locationGrade: fg.get('locationGrade') == undefined || null
          ? null
          : fg.get('locationGrade').value[i],

        extensionGrade: fg.get('extensionGrade') == undefined || null
          ? null
          : fg.get('extensionGrade').value[i],
      };
      this.evaluation.answers.push(answer);
    }
    console.log("Questionario até agr ", this.evaluation)
  }

  goBack2Home() {
    this.route.navigate(['home']);
  }

  private listPatients() {
    this.patientService.getPatientList()
      .subscribe(
        data => {
          this.patients = data;
        },
        err => {
          console.log(err);
        }
      )
  }

  createieFormGroup() {
    return new FormGroup({
      'patientId': new FormControl(this.evaluation.patientId, [Validators.required]),
      'location': new FormControl(this.evaluation.location, [Validators.required]),
    });
  }

  validateForm(fc: FormGroup, array: any[]) {
    console.log(fc.get('infoSource'));
    if (this.invalids.length > 0) {
      this.invalids = [];
    }
    for (let index = 0; index < fc.get('infoSource').value.length; index++) {
      const element = fc.get('infoSource').value[index];
      if (element == null || element == undefined) {
        this.invalids.push(" " + array[index].code)
      }
    }
    return this.invalids;
  }
  createefFormGroup(data: Questions) {
    return this.formBuilder.group({
      questionId: this.buildQuestionsId(data == null ? null : data.environmentalFactors),
      infoSource: this.buildInfoSource(data == null ? null : data.environmentalFactors),
      problemDescription: this.buildProblemDescription(data == null ? null : data.environmentalFactors),
      generalGrade: this.buildGrade(data == null ? null : data.environmentalFactors),
    });
  }

  createapFormGroup(data: Questions) {
    return new FormGroup({
      questionId: this.buildQuestionsId(data == null ? null : data.activityAndParticipation),
      infoSource: this.buildInfoSource(data == null ? null : data.activityAndParticipation),
      problemDescription: this.buildProblemDescription(data == null ? null : data.activityAndParticipation),
      capacityGrade: this.buildGrade(data == null ? null : data.activityAndParticipation),
      performanceGrade: this.buildGrade(data == null ? null : data.activityAndParticipation),
    });
  }

  createbsFormGroup(data: Questions) {
    return new FormGroup({
      questionId: this.buildQuestionsId(data == null ? null : data.bodyStructures),
      infoSource: this.buildInfoSource(data == null ? null : data.bodyStructures),
      problemDescription: this.buildProblemDescription(data == null ? null : data.bodyStructures),
      locationGrade: this.buildGrade(data == null ? null : data.bodyStructures),
      natureGrade: this.buildGrade(data == null ? null : data.bodyStructures),
      extensionGrade: this.buildGrade(data == null ? null : data.bodyStructures),
    });
  }

  createbfFormGroup(data: Questions) {
    return new FormGroup({
      questionId: this.buildQuestionsId(data == null ? null : data.bodyFunctions),
      infoSource: this.buildInfoSource(data == null ? null : data.bodyFunctions),
      problemDescription: this.buildProblemDescription(data == null ? null : data.bodyFunctions),
      generalGrade: this.buildGrade(data == null ? null : data.bodyFunctions),
    });
  }

  buildQuestionsId(questions: Question[]) {
    if (questions != null || questions != undefined) {
      const values = questions.map(v =>
        new FormControl(v.id, Validators.required));

      return this.formBuilder.array(values, Validators.required);
    }
    return this.formBuilder.array([new FormControl('')], Validators.required);
  }

  buildInfoSource(questions: Question[]) {
    if (questions != null || questions != undefined) {
      const values = questions.map(() => {
        new FormControl(this.answer.infoSource, [Validators.required])
      });
      return this.formBuilder.array(values, [Validators.required]);
    }
    return this.formBuilder.array([new FormControl('', [Validators.required])], Validators.required);
  }

  buildProblemDescription(questions: Question[]) {
    if (questions != null || questions != undefined) {
      const values = questions.map(() => {
        new FormControl(this.answer.problemDescription)
      });
      return this.formBuilder.array(values);
    }
    return this.formBuilder.array([new FormControl('')]);
  }

  buildGrade(questions: Question[]) {
    if (questions != null || questions != undefined) {
      const values = questions.map(() =>
        new FormControl(Validators.required)
      );
      return this.formBuilder.array(values, Validators.required);
    }
    return this.formBuilder.array([new FormControl('')], Validators.required);
  }
}
