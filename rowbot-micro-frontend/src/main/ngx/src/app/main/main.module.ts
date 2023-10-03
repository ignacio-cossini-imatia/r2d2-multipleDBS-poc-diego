import { NgModule } from '@angular/core';
import { OntimizeWebModule } from 'ontimize-web-ngx';

import { SharedModule } from '../shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ProfileComponent } from './profile/profile.component';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    SharedModule,
    OntimizeWebModule,
    MainRoutingModule
  ],
  declarations: [
    MainComponent,
    ProfileComponent
  ],
  providers: [DatePipe],
})
export class MainModule { }
