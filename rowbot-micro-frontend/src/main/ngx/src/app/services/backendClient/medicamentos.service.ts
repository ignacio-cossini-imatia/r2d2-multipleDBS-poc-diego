import { Injectable } from '@angular/core';
import { AbstractBackendClient } from './generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService extends AbstractBackendClient  {


  public getEnpoint(): string {
    return "/medicamento";
  }

  public getIdForCN (CN: string) {
    let url= '/id?cn='+CN;
    return this.get(url);
  }

}
