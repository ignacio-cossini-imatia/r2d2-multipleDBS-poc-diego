import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Codes } from 'ontimize-web-ngx';
import { MainService } from './services/main.service';
import { KeycloakService } from './services/keycloak.service';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {

  constructor(private router: Router, private keycloakService: KeycloakService, private mainService: MainService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tenantId = this.keycloakService.getTenant();
    let modifiedReq: HttpRequest<any>;

    if (tenantId && tenantId.length > 0 && !req.url.includes(this.keycloakService.getUrl())) {
      modifiedReq = req.clone({
        headers: req.headers.set('X-Tenant', tenantId),
      });
      return next.handle(modifiedReq).pipe((r)=> {
        if(this.mainService) this.mainService.setServerDown(false);
        return r;
      }, catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (this.mainService) {
            this.mainService.setServerDown(err.status === 0);
          }
          if (err.status === 401 || err.status === 403) {
            this.router.navigate([Codes.LOGIN_ROUTE], {queryParams: {'status' : err.status}});
          }
          return throwError(err);
        }
      }));
    } else {
      return next.handle(req);
    }
  }
}
