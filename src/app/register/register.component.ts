import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Person } from '../interfaces/person';
import { Address } from '../interfaces/address';
import { CepService } from '../service/cep.service';
import { MatSnackBar } from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  cepNotFound = false;
  equalPass = true;
  personForm: FormGroup;
  addressForm: FormGroup;
  states: any = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'TO'];
  Roles: any = ['Admin', 'Paciente', 'Terapeuta'];

  genders: Gender[] = [
    { value: 'F', viewValue: 'Feminino' },
    { value: 'M', viewValue: 'Masculino' },
    { value: 'O', viewValue: 'Não informar' }
  ];

  constructor(private cepService: CepService,private snackbar: MatSnackBar,private _adapter: DateAdapter<any>) {
    this.personForm = this.createPersonForm();
    this.addressForm = this.createAddressForm();
    this._adapter.setLocale('br');
  }


  @Input() person: Person = <Person>{};
  @Input() address: Address = <Address>{};


  searchCEP(){
    this.cepService.searchCEP(this.addressForm.controls.postalCode.value)
    .subscribe(
      (res: any) => {
        if(res.erro == true){
          this.cepNotFound = true;
          this.snackbar.open('Não foi possível localizar o CEP', 'Dismiss', {
            duration: 2000,
            panelClass: ['error-snackbar']
          });
        }else{
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

  validatePass(){
    this.equalPass = this.personForm.value.password === this.personForm.value.confirmPass;
  }

  fillAddressFields(cep:any){
    this.addressForm.controls['publicPlace'].setValue(cep.logradouro);
    this.addressForm.controls['neighborhood'].setValue(cep.bairro);
    this.addressForm.controls['city'].setValue(cep.localidade);
    this.addressForm.controls['state'].setValue(cep.uf);
  }

  createPersonForm() {
    return new FormGroup({
      'email': new FormControl(this.person.email, [Validators.required, Validators.email]),
      'password': new FormControl(this.person.password,[Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
      'confirmPass': new FormControl(this.person.password,[Validators.required, Validators.minLength(6), Validators.maxLength(8)]),
      'firstName': new FormControl(this.person.firstName,[Validators.required]),
      'lastName': new FormControl(this.person.lastName,[Validators.required]),
      'cpf': new FormControl(this.person.lastName,[Validators.required, Validators.pattern('[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}')]),
      'sex': new FormControl(this.person.sex,[Validators.required]),
      'telephoneNumber': new FormControl(this.person.telephoneNumber,[Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
      'birthDate': new FormControl(this.person.birthDate,[Validators.required]),
    });
  }

  createAddressForm(){
    return new FormGroup({
      'publicPlace': new FormControl(this.address.publicPlace, [Validators.required]),
      'houseNumber': new FormControl(this.address.houseNumber,[Validators.required]),
      'neighborhood': new FormControl(this.address.neighborhood,[Validators.required]),
      'city': new FormControl(this.address.city,[Validators.required]),
      'state': new FormControl(this.address.state,[Validators.required]),
      'postalCode': new FormControl(this.address.postalCode,[Validators.required,Validators.minLength(8),Validators.maxLength(8)])
    });    
  }

  ngOnInit() {
  }

  onSubmit(){
    this.person = this.personForm.value;
    this.address = this.addressForm.value;
    this.person.address = this.address;
    this.person.active = true;
    this.person.birthDate = new Date(this.person.birthDate).toISOString();
    console.log(this.person.birthDate);
    console.log('submit');
    console.log(this.person);   
  }
}

interface Gender {
  value: string;
  viewValue: string;
}