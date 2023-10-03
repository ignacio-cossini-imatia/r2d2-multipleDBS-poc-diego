import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicamentosRoutingModule } from './medicamentos-routing.module';
import { MedicamentosHomeComponent } from './medicamentos-home/medicamentos-home.component';
import { MedicamentosNewComponent } from './medicamentos-new/medicamentos-new.component';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  declarations: [MedicamentosHomeComponent, MedicamentosNewComponent ],
  imports: [
    CommonModule,
    MedicamentosRoutingModule,
    OntimizeWebModule,
    TextMaskModule
  ]
})
export class MedicamentosModule { }
