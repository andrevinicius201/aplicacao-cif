import { Component, OnInit, Inject } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
import { PatientListService } from '../service/patient-list.service';
import {MatCardModule} from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OpenModalService } from '../shared/modal-dialog/open-modal-service.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  searchTerm: string;
  public patients = [];

  constructor(
    private openModalService: OpenModalService,
    private session:SessionService,
    private router:Router,
    private _patientlist:PatientListService
    ){}

  ngOnInit(){
    console.log(this.session.getUserLogged());
    if(this.session.getUserLogged() == null){
      this.router.navigate(['']);
    }
    
    if(localStorage.getItem('role') == 'PATIENT'){
      this.router.navigate(['evaluations']);
    }

    this._patientlist.getPatientList()
        .subscribe(data => this.patients = data);
  }

  deletePatient(){
    const data = {
      text: 'Tem certeza que deseja excluir o paciente?',
      title: 'Excluir paciente',
      buttonYes: 'Sim',
      buttonNo: 'Não'
    }
    this.openModalService.openDialog(data).subscribe(res=>{
      if(res){
        console.log('RES');
        console.log(res);
      }else{
        console.log('Paciente não excluido');
      }
    })
  }

}
