import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginStorageService } from 'ontimize-web-ngx';
import { KeycloakService } from '../../shared/services/keycloak.service';
import { CONFIG } from '../../app.config';
import { AbstractBackendClient } from './generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class PacienteHttpClient extends AbstractBackendClient  {


  public getEnpoint(): string {
    return "/paciente";
  }

}
