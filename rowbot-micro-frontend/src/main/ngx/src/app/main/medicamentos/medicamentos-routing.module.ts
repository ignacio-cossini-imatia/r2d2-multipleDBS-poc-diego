import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicamentosHomeComponent } from './medicamentos-home/medicamentos-home.component';
import { MedicamentosNewComponent } from './medicamentos-new/medicamentos-new.component';


const routes: Routes = [
  { path: '', component: MedicamentosHomeComponent },
  { path: 'new', component: MedicamentosNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentosRoutingModule { }
