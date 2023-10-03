import { Injectable } from '@angular/core';
import { AbstractBackendClient } from './generic-service.service';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CONFIG } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class ValidationService extends AbstractBackendClient{



  public getEnpoint(): string {
    return "/validate";
  }

  public getDni(dni: string){
    var url= "/dni/"+ dni;
    return this.get(url);
  }


  public getNotPromise(enpoint){
    const url  = CONFIG.apiEndpoint + this.getEnpoint() + enpoint;

    return this.http.get(url, this.getOption(url));
  }

  isValidDni(dni: string): Promise<any> {
    return this.getDni(dni);
  }

  isValidateCodigoNacional(codigonacional: string){
    var url = "/cn/" + codigonacional;
    return this.get(url);
  }

}
