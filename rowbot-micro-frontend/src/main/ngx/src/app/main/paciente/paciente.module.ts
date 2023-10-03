import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PacienteRoutingModule } from './paciente-routing.module';
import { PacienteHomeComponent } from './paciente-home/paciente-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { MatDatepickerModule, MatNativeDateModule, MatPaginatorModule } from '@angular/material';
import { PacienteDetailComponent } from './paciente-detail/paciente-detail.component';
import { PacienteNewComponent } from './paciente-new/paciente-new.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ PacienteHomeComponent, PacienteNewComponent, PacienteDetailComponent],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    SharedModule,
    OntimizeWebModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class PacienteModule { }
