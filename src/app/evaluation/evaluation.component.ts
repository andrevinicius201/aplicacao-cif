import { Component, OnInit, ViewChild, Input, Renderer2, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, FormGroupDirective, AbstractControl } from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { Question } from '../interfaces/question';
import { Questions } from '../interfaces/questions';
import { Observable } from 'rxjs';
import { MatExpansionPanel, MatRadioGroup, throwToolbarMixedModesError, MatSnackBar } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Patient } from '../interfaces/patient';
import { Person } from '../interfaces/person';
import { PatientListService } from '../service/patient-list.service';
import { Evaluation } from '../interfaces/evaluation';
import { Answer } from '../interfaces/answer';
import { Gerador } from './gerador';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { EvaluationService } from '../service/evaluation.service';
declare var xepOnline: any;
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

  private answers: Answer[] = [];

  @ViewChild("factorPanel") factorPanel: MatExpansionPanel;
  @ViewChild("aNpPanel") aNpPanel: MatExpansionPanel;
  @ViewChild("structurePanel") structurePanel: MatExpansionPanel;
  @ViewChild("functionPanel") functionPanel: MatExpansionPanel;
  @ViewChild("invalid") invalid: ElementRef;
  @ViewChild("print") print: ElementRef;

  questions: Observable<Questions>;
  questionList: Questions;

  constructor(
    private renderer: Renderer2,
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
    // this.bsFormGroup = this.createbsFormGroup();
    // this.bfFormGroup = this.createbfFormGroup();
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

  setQuestionsIdAndValidations(fg: FormGroup, list: any[]) {
    for (let index = 0; index < list.length; index++) {
      fg.controls.questionId.get([index]).setValue(list[index].id);
      fg.controls.infoSource.get([index]).setValidators(Validators.required);
      if (fg.controls.generalGrade != undefined) {
        console.log("generalGrade setado")
        fg.controls.generalGrade.get([index]).setValidators(Validators.required);
      }
      else if (fg.controls.cGrade != undefined) {
        fg.controls.cGrade.get([index]).setValidators(Validators.required);
        fg.controls.pGrade.get([index]).setValidators(Validators.required);
      }
      else {
        fg.controls.locationGrade.get([index]).setValidators(Validators.required);
        fg.controls.natureGrade.get([index]).setValidators(Validators.required);
        fg.controls.extensionGrade.get([index]).setValidators(Validators.required);
      }
    }
  }

  download(){
    return xepOnline.Formatter.Format('print', {renderer:'download()'});
  }

  newEvaluation(){
    this.evaluationService.newEvaluation(this.evaluation).subscribe(
      data =>{
      this.snackbar.open('Avaliação salva com sucesso!', 'Accept', {
        duration: 2000,
        panelClass: ['green-snackbar']
      });
      this.route.navigate(['home']);
    },
    err =>{
      this.snackbar.open('Erro ao salvar avaliação!', 'Accept', {
        duration: 2000,
        panelClass: ['green-snackbar']
      });
    }
    )
  }

  showFirstForm() {
    // let doc = new jspdf();

    // let specialElementHandlers = {
    //   '#editor': function(element, renderer) {
    //     return true;
    //   }
    // };

    // let content = this.print.nativeElement;
    // doc.fromHTML(content, 15,15, {
    //   'width':190,
    //   'elementHandlers':specialElementHandlers
    // });

    // doc.save('test.pdf');
    // var data = document.getElementById('print');

    // let pdf = new jspdf();
    // html2canvas(data).then(canvas => {
    //   var imgWidth = 190;
    //   var pageHeight = 295;
    //   var imgHeight = canvas.height * imgWidth / canvas.width;
    //   var heightLeft = imgHeight;
    //   const contentDataURL = canvas.toDataURL('image/png')
    //   pdf.save('MYPdf.pdf');
    //   pdf.addImage(contentDataURL, 'PNG', 0,0,imgWidth,imgHeight)
    // });
  }

  showSecondForm() {
    console.log("2ND FORM: ", this.efFormGroup);
  }

  addIEtoBounderObject() {
    this.evaluation = this.ieFormGroup.value;
    this.evaluation.therapistId = localStorage.getItem('name');
    this.evaluation.date = new Date().toISOString();
    this.evaluation.answers = [];
    console.log(this.evaluation)
  }

  finishEvaluation() {
    this.addAnswers(this.efFormGroup);
    this.addAnswers(this.apFormGroup);
    this.addAnswers(this.bfFormGroup);
    this.addAnswers(this.bsFormGroup);
  }

  getQuestionCode(answer:Answer, array:any[]){
    var item = array.find(i => i.id == answer.questionId);
    return item != undefined ? item.code : null;
  }

  getQuestionTitle(answer:Answer, array:any[]){
    var item = array.find(i => i.id == answer.questionId);
    return item != undefined ? item.title : null;
  }

  addAnswers(fg: FormGroup) {
    this.invalids = [];
    const list = fg.get('questionId').value;
    for (let i = 0; i < list.length; i++) {
      let answer: Answer = {
        questionId: fg.get('questionId').value[i],
        infoSource: fg.get('infoSource').value[i],
        problemDescription: fg.get('problemDescription').value[i],

        generalGrade: fg.get('generalGrade') == undefined || null
          ? null
          : fg.get('generalGrade').value[i],

        pGrade: fg.get('pGrade') == undefined || null
          ? null
          : fg.get('pGrade').value[i],

        cGrade: fg.get('cGrade') == undefined || null
          ? null
          : fg.get('cGrade').value[i],

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

  pdf() {
    Gerador.geradorPDF(this.evaluation, this.questionList);
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
      cGrade: this.buildGrade(data == null ? null : data.activityAndParticipation),
      pGrade: this.buildGrade(data == null ? null : data.activityAndParticipation),
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
      const values = questions.map((v: Question) => {
        new FormControl(this.answer.infoSource, [Validators.required])
      });
      return this.formBuilder.array(values, [Validators.required]);
    }
    return this.formBuilder.array([new FormControl('', [Validators.required])], Validators.required);
  }

  buildProblemDescription(questions: Question[]) {
    if (questions != null || questions != undefined) {
      const values = questions.map((v: Question) => {
        new FormControl(this.answer.problemDescription)
      });
      return this.formBuilder.array(values);
    }
    return this.formBuilder.array([new FormControl('')]);
  }

  buildGrade(questions: Question[]) {
    if (questions != null || questions != undefined) {
      const values = questions.map((v: Question) =>
        new FormControl(Validators.required)
      );
      return this.formBuilder.array(values, Validators.required);
    }
    return this.formBuilder.array([new FormControl('')], Validators.required);
  }
}
