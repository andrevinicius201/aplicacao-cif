import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  panelOpenState = false;
  patientCPF: String; 
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  constructor(private route:Router,private _formBuilder: FormBuilder) {
    if(this.route.getCurrentNavigation().extras != "undefined"){
      this.patientCPF = this.route.getCurrentNavigation().extras.state.patientCpf;
    }
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }


}
