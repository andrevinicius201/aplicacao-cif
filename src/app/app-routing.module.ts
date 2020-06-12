import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { PatientCenterComponent } from './patient-center/patient-center.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EvaluationListComponent } from './evaluation-list/evaluation-list.component';
import { EvaluationResultComponent } from './evaluation-result/evaluation-result.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent},
  { path: 'evaluations', component: PatientCenterComponent },
  { path: 'patientRegister', component: PatientRegisterComponent},
  { path: 'patientList', component: PatientListComponent},
  { path: 'editProfile', component: EditProfileComponent},
  { path: 'evaluation', component: EvaluationComponent},
  { path: 'forgotPassword', component: ForgotPasswordComponent},
  { path: 'evaluation-list', component: EvaluationListComponent},
  { path: 'evaluation-details/:id', component: EvaluationResultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
