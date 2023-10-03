import { Injectable } from '@angular/core';
import { AbstractBackendClient } from './generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class MaestrosService  extends AbstractBackendClient  {


  public getEnpoint(): string {
    return "/maestros";
  }

  public getFormaFarmaceutica(){
    var url = "/forma_farmaceutica"
    return this.get(url);
  }
}
