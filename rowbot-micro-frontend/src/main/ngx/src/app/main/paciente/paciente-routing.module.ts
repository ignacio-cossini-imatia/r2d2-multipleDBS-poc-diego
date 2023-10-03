import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PacienteHomeComponent } from './paciente-home/paciente-home.component';
import { PacienteDetailComponent } from './paciente-detail/paciente-detail.component';
import { PacienteNewComponent } from './paciente-new/paciente-new.component';


const routes: Routes = [
  { path: '', component: PacienteHomeComponent },
  { path: ':id', component: PacienteDetailComponent },
  { path: '/update', component: PacienteDetailComponent },
  { path: '/new', component: PacienteNewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
