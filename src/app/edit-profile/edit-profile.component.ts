import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Person } from '../interfaces/person';
import { Address} from '../interfaces/address';
import { CepService } from '../service/cep.service';
import { MatSnackBar } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../shared/format-datepicker';
import { SessionService } from '../service/session.service';
import { AuthService } from '../service/auth.service';
import { EditProfileService } from '../service/edit-profile.service';
import { OpenModalService } from '../shared/modal-dialog/open-modal-service.service';
import { RemoveAccountService } from '../service/remove-account.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  user:Person;
  personForm: FormGroup;
  addressForm: FormGroup;
  cepNotFound = false;
  equalPass = true;
  loading = false;
  patient = null;
  states: any = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SE', 'SP', 'TO'];
  Roles: any = ['Admin', 'Paciente', 'Terapeuta'];

  genders: Gender[] = [
    { value: 'F', viewValue: 'Feminino' },
    { value: 'M', viewValue: 'Masculino' },
    { value: 'O', viewValue: 'Não informar' }
  ];
 
  
  constructor(
    private openModalService: OpenModalService,
    private removeAccount: RemoveAccountService,
    private cepService:CepService, 
    private snackbar:MatSnackBar, 
    private _authservice:AuthService, 
    private session:SessionService,
    private router: Router,
    private editProfileService: EditProfileService
    ) { 
    this.personForm = this.createPersonForm();
    this.addressForm = this.createAddressForm();

  }

  @Input() person:Person = <Person>{};
  @Input() address:Address = <Address>{};

  searchCEP() {
    this.cepService.searchCEP(this.addressForm.controls.postalCode.value)
      .subscribe(
        (res: any) => {
          if (res.erro == true) {
            this.cepNotFound = true;
            this.snackbar.open('Não foi possível localizar o CEP', 'Dismiss', {
              duration: 2000,
              panelClass: ['error-snackbar']
            });
          } else {
            this.cepNotFound = false;
            this.fillAddressFields(res);
          }
        },
        err => {
          this.snackbar.open('Não foi possível localizar o CEP', 'Dismiss', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }
      );
  }

  validatePass() {
    this.equalPass = this.personForm.value.password === this.personForm.value.confirmPass;
  }

  fillAddressFields(cep: any) {
    this.addressForm.controls['publicPlace'].setValue(cep.logradouro);
    this.addressForm.controls['neighborhood'].setValue(cep.bairro);
    this.addressForm.controls['city'].setValue(cep.localidade);
    this.addressForm.controls['state'].setValue(cep.uf);
  }

  ngOnInit(){
    console.log("rota direcionada");
    this._authservice.getUserData(this.session.userId)
          .subscribe(data => this.user = data);
    

  }

  createPersonForm() {
    return new FormGroup({
      'email': new FormControl(this.person.email, [Validators.required, Validators.email]),
      'password': new FormControl(this.person.password, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
      'confirmPass': new FormControl(this.person.password, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
      'firstName': new FormControl(this.person.firstName, [Validators.required]),
      'lastName': new FormControl(this.person.lastName, [Validators.required]),
      'cpf': new FormControl(this.person.lastName, [Validators.required, Validators.pattern('[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}')]),
      'sex': new FormControl(this.person.sex, [Validators.required]),
      'telephoneNumber': new FormControl(this.person.telephoneNumber, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      'birthDate': new FormControl(this.person.birthDate, [Validators.required]),
      'patient': new FormGroup({
        'therapistID': new FormControl(''),
        'note': new FormControl('')
      })
    });
  }

  deleteTherapist(id:String){
    const data = {
      text: 'Tem certeza que deseja excluir seu cadastro?',
      title: 'Excluir cadastro',
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
              this.session.logoutUser();
            }
          );
      }else{
        console.log('Cadastro não excluído');
      }
    })
  }

  createAddressForm() {
    return new FormGroup({
      'publicPlace': new FormControl(this.address.publicPlace, [Validators.required]),
      'houseNumber': new FormControl(this.address.houseNumber, [Validators.required]),
      'neighborhood': new FormControl(this.address.neighborhood, [Validators.required]),
      'city': new FormControl(this.address.city, [Validators.required]),
      'state': new FormControl(this.address.state, [Validators.required]),
      'postalCode': new FormControl(this.address.postalCode, [Validators.required, Validators.minLength(8), Validators.maxLength(8)])
    });
  }

  onSubmit() {
    this.loading = true;
    this.person = this.personForm.value;
    this.address = this.addressForm.value;
    this.person.address = this.address;
    this.person.patient = this.patient;
    this.person.birthDate = new Date(this.person.birthDate).toISOString();
    console.log(this.person);
    this.editProfileService.updateProfile(this.person)
      .subscribe(
        (res: any) => {
          this.snackbar.open('Dados atualizados!', 'OK', {
            duration: 2000,
            panelClass: ['green-snackbar']
          });
        },
        (erro: any) => {
          this.loading = false;
          console.log(erro);
        }
      )
  }

}

interface Gender {
  value: string;
  viewValue: string;
}