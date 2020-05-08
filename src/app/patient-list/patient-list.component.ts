import { Component, OnInit, Inject } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Router } from '@angular/router';
import { PatientListService } from '../service/patient-list.service';
import {MatCardModule} from '@angular/material/card';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { OpenModalService } from '../shared/modal-dialog/open-modal-service.service';
import { RemoveAccountService } from '../service/remove-account.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  searchTerm: string;
  public patients = [];
  title:String = "Listagem de paciente";

  constructor(
    private openModalService: OpenModalService,
    private session:SessionService,
    private router:Router,
    private _patientlist:PatientListService,
    private removeAccount: RemoveAccountService,
    private snackbar: MatSnackBar
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

  deletePatient(id:String){
    const data = {
      text: 'Tem certeza que deseja excluir o paciente?',
      title: 'Excluir paciente',
      buttonYes: 'Sim',
      buttonNo: 'Não'
    }
    this.openModalService.openDialog(data).subscribe(res=>{
      if(res){
        console.log("exclusao solicitada")
        this.removeAccount.removeAccount(id)
          .subscribe(
            (res: any) => {
              location.reload();
              this.snackbar.open('Cadastro removido', 'OK ', {
                duration: 2000,
              });
            }
          );
      }else{
        console.log('Paciente não excluido');
      }
    })
  }

}
