import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Roles: any = ['Admin', 'Paciente', 'Terapeuta'];

  genders: Gender[] = [
    {value: 'F', viewValue: 'Feminino'},
    {value: 'M', viewValue: 'Masculino'},
    {value: 'O', viewValue: 'Não informar'}
  ];

  constructor() { }

  ngOnInit() {
  }

}

interface Gender {
  value: string;
  viewValue: string;
}