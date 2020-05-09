import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  panelOpenState = false;
  patientCPF: String; 
  state$: Observable<object>;
  
  constructor(private route:Router) {
    if(this.route.getCurrentNavigation().extras != "undefined"){
      this.patientCPF = this.route.getCurrentNavigation().extras.state.patientCpf;
    }
  }

  ngOnInit(): void {
    console.log("CPF",this.patientCPF);
  }

}
