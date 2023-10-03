import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Codes, OntimizeEEService, Observable } from 'ontimize-web-ngx';
import { share } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';

@Injectable({providedIn: 'root'})
export class MultitenantService extends OntimizeEEService {
  private keycloakService: KeycloakService;

  constructor(injector: Injector) {
    super(injector);
    this.keycloakService = this.injector.get(KeycloakService);
  }

  protected buildHeaders(): HttpHeaders {
    let headers = super.buildHeaders();
    let tenantId = this.keycloakService.getTenant();
    if (tenantId && tenantId.length > 0) headers = headers.set('X-Tenant', tenantId);
    return headers;
  }

  public endsession(user: string, sessionId: any): Observable<number> {
    const dataObservable: Observable<any> = new Observable(observer => {
      this.keycloakService.logout(Codes.LOGIN_ROUTE);
      observer.next(0);
    });
    return dataObservable.pipe(share());
  }
}
