import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { AuthGuard } from './service/auth-gaurd.service';
import { UnivoxComponent } from './univox/univox.component';
import { UsersComponent } from './univox/users/users.component';
import { FacultyComponent } from './univox/faculty/faculty.component';
import { DegreeComponent } from './univox/degree/degree.component';
import { CriteriaComponent } from './univox/criteria/criteria.component';
import { ApplicantComponent } from './univox/applicant/applicant.component';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: FullLayoutComponent},
  { path: 'univox', component: UnivoxComponent, canActivate: [AuthGuard],
  children: [
    { path: 'users', component: UsersComponent },
    { path: 'faculties', component: FacultyComponent },
    { path: 'degrees', component: DegreeComponent },
    { path: 'criterias', component: CriteriaComponent },
    { path: 'applicant', component: ApplicantComponent },
  ] },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
