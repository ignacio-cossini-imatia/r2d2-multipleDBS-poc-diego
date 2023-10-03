import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LoginStorageService } from 'ontimize-web-ngx';
import { CONFIG, getRecoverPasswordUrl } from '../../app.config';
import { KeycloakService } from './keycloak.service';

@Injectable({providedIn: 'root'})
export class MainService {

  static generalLogo = 'assets/icons/ontimize48.png';

  private serverDown: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient,
    private loginStorageService: LoginStorageService,
    private keycloakService: KeycloakService
  ) {
  }

  public buildHeaders(url: string): HttpHeaders {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    headers = headers.set('Content-Type', 'application/json;charset=UTF-8');
    let exclude = false;
    const path = new URL(url).pathname;
    this.keycloakService.getExcludedUrls().forEach(e => {
      if(new RegExp(e, 'i').test(path)) exclude = true;
    });
    if(!exclude) headers = headers.set('Authorization', 'Bearer ' + this.loginStorageService.getSessionInfo().id);
    let tenantId = this.keycloakService.getTenant();
    if(tenantId && tenantId.length > 0) headers = headers.set('X-Tenant', tenantId);
    return headers;
  }

  getUserInfo() {
    const url = CONFIG.apiEndpoint + '/users/loginUser/search';
    const options = { headers: this.buildHeaders(url) };
    const requestBody = {};
    return this.httpClient.post(
      url,
      requestBody,
      options);
  }

  getTenantInfo(tenantId: String) {
    const url = CONFIG.apiEndpoint + '/tenant?tenantId=' + tenantId;
    const options = {
      headers: this.buildHeaders(url),
      responseType: 'text' as 'json'
    };
    return this.httpClient.get(url, options);
  }

  listTenants(email: String) {
    const url = CONFIG.apiEndpoint + '/userTenants?userId=' + email;
    const options = {
      headers: this.buildHeaders(url),
      responseType: 'text' as 'json'
    };
    return this.httpClient.get(url, options);
  }

  getRecoverPasswordUrl(user: String) {
    const redirectTo = encodeURIComponent(CONFIG.apiEndpoint);
    let url = getRecoverPasswordUrl() + '?redirectTo=' + redirectTo;
    if (user) {
      url += '&user=' + user;
    }
    return url;
  }

  setServerDown(down: boolean) {
    if(down !== this.serverDown.getValue()) this.serverDown.next(down);
  }

  getServerDown() {
    return this.serverDown;
  }
}
