import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakConfig, KeycloakEvent, KeycloakEventType, KeycloakInitOptions, KeycloakService as KCService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { LoginStorageService, SessionInfo } from 'ontimize-web-ngx';
import { CONFIG } from '../../app.config';
import { CookieService } from './cookie.service';

@Injectable({providedIn: 'root'})
export class KeycloakService {
  private timer: any = undefined;

  constructor(
    private httpClient: HttpClient,
    private keycloakService: KCService,
    private loginStorageService: LoginStorageService,
    private locationStrategy: LocationStrategy,
    private cookieService: CookieService
  ) {
    this.keycloakService.keycloakEvents$.subscribe(async (e: KeycloakEvent) => {
      if (e.type === KeycloakEventType.OnTokenExpired) {
        this.updateToken();
      } else if (e.type === KeycloakEventType.OnAuthSuccess) {
        this.keycloakService.getToken().then(token => {
          if (token) {
            this.startAutoUpdateToken(4);

            let username = localStorage.getItem('keycloak-loginhint');

            if (username) {
              let sessionInfo: SessionInfo = {
                id: token,
                user: username
              };
              this.loginStorageService.storeSessionInfo(sessionInfo);
            } else {
              this.keycloakService.loadUserProfile().then(profile => {
                localStorage.setItem('keycloak-loginhint', profile.username);
                let sessionInfo: SessionInfo = {
                  id: token,
                  user: profile.username
                };
                this.loginStorageService.storeSessionInfo(sessionInfo);
              });
            }
          }
        });
      } else if (e.type === KeycloakEventType.OnAuthLogout) {
        this.stopAutoUpdateToken();

        this.cookieService.delete('implatform_tenantId');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('keycloak-url');
        localStorage.removeItem('keycloak-realm');
        localStorage.removeItem('keycloak-client');
        localStorage.removeItem('keycloak-loginhint');

        this.loginStorageService.sessionExpired();
      }
    });
  }

  public getExcludedUrls() {
    return ['/tenant', '/userTenants'];
  }

  public getKeycloak() {
    return this.keycloakService;
  }

  public getTenant() {
    return localStorage.getItem('tenantId');
  }

  public getUrl() {
    let result = undefined;
    if (this.keycloakService.getKeycloakInstance()) result = this.keycloakService.getKeycloakInstance().authServerUrl;
    return result;
  }

  public getRealm() {
    let result = undefined;
    if (this.keycloakService.getKeycloakInstance()) result = this.keycloakService.getKeycloakInstance().realm;
    return result;
  }

  public getClientId() {
    let result = undefined;
    if (this.keycloakService.getKeycloakInstance()) result = this.keycloakService.getKeycloakInstance().clientId;
    return result;
  }

  public initialize(): Promise<void> {
    let tenant = localStorage.getItem('tenantId');
    let url = localStorage.getItem('keycloak-url');
    let realm = localStorage.getItem('keycloak-realm');
    let clientId = localStorage.getItem('keycloak-client');
    let prompt = localStorage.getItem('keycloak-prompt');

    if (tenant && url && realm && clientId) {
      if (prompt === 'none') {
        localStorage.removeItem('keycloak-prompt');
        return new Promise<void>(async (resolve, reject) => {
          this.config(url, realm, clientId).then(() => {
            resolve();
          }).catch((err) => {
            reject(err);
          });
        });
      } else {
        return this.login(tenant, url, realm, clientId);
      }
    } else {
      tenant = this.cookieService.get('implatform_tenantId');
      if (tenant) {
        let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')
          .set('Content-Type', 'application/json;charset=UTF-8');
        let url = CONFIG.apiEndpoint + '/tenant?tenantId=' + tenant;
        let options = {
          headers: headers,
          responseType: 'text' as 'json'
        };
        this.httpClient.get(url, options).subscribe((resp) => {
          if (resp) {
            let tenantInfo = JSON.parse(resp.toString());
            if (tenantInfo) {
              return this.login(tenant, tenantInfo.url, tenantInfo.realm, tenantInfo.client);
            }
          }
        }, (err) => {
          console.log('Failed to get tenant info: ' + err.message);
        });
      }
    }
    return new Promise<void>(async (resolve) => resolve());
  }

  public isLoggedIn(): Promise<boolean> {
    if (this.keycloakService.getKeycloakInstance()) {
      return this.keycloakService.isLoggedIn();
    } else {
      return new Promise(async (resolve) => resolve(false));
    }
  }

  public login(tenant: string, url: string, realm: string, clientId: string, redirectUrl?: string, username?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.config(url, realm, clientId).then((autenticated) => {
        this.cookieService.set('implatform_tenantId', tenant);
        localStorage.setItem('tenantId', tenant);
        localStorage.setItem('keycloak-url', url);
        localStorage.setItem('keycloak-realm', realm);
        localStorage.setItem('keycloak-client', clientId);
        if (username) localStorage.setItem('keycloak-loginhint', username);

        if (autenticated === true) {
          resolve();
        } else {
          let koptions: KeycloakLoginOptions = {};
          if (redirectUrl) koptions.redirectUri = this.getFullUrl(redirectUrl);
          if (username) {
            koptions.loginHint = username;
          } else {
            koptions.prompt = 'none';
            localStorage.setItem('keycloak-prompt', 'none');
          }
          this.keycloakService.login(koptions).then(() => {
            resolve();
          }).catch((err) => {
            reject('Failed to login: ' + err);
          });
        }
      }).catch(err => {
        reject('Failed to configure keycloak: ' + err);
      });
    });
  }

  public logout(redirectUrl?: string): Promise<void> {
    this.stopAutoUpdateToken();

    this.cookieService.delete('implatform_tenantId');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('keycloak-url');
    localStorage.removeItem('keycloak-realm');
    localStorage.removeItem('keycloak-client');
    localStorage.removeItem('keycloak-loginhint');

    if (this.keycloakService.getKeycloakInstance()) {
      this.keycloakService.clearToken();

      let redirectUri = undefined;
      if (redirectUrl) redirectUri = this.getFullUrl(redirectUrl);
      return this.keycloakService.logout(redirectUri);
    } else {
      return new Promise(async (resolve) => resolve());
    }
  }

  public getCurrentUser(): string {
    return localStorage.getItem('keycloak-loginhint');
  }

  private config(url: string, realm: string, clientId: string, token?: string, refreshToken?: string): Promise<boolean> {
    let kc: KeycloakConfig = {
      url: url,
      realm: realm,
      clientId: clientId
    };

    let kio: KeycloakInitOptions = {};
    kio.checkLoginIframe = false;
    if (token && refreshToken) {
      kio.token = token;
      kio.refreshToken = refreshToken;
    }

    return this.keycloakService.init({
      config: kc,
      initOptions: kio,
      enableBearerInterceptor: true,
      loadUserProfileAtStartUp: false,
      bearerExcludedUrls: this.getExcludedUrls()
    });
  }

  private getFullUrl(path: string): string {
    let basePath = this.locationStrategy.getBaseHref();
    if (basePath.substring(basePath.length - 1) === '/') basePath = basePath.substring(0, basePath.length - 1);
    return location.origin + basePath + path;
  }

  private updateToken() {
    this.keycloakService.updateToken(-1).then(refreshed => {
      if (refreshed) {
        this.keycloakService.getToken().then(token => {
          let sessionInfo = this.loginStorageService.getSessionInfo();
          if (sessionInfo) {
            (sessionInfo as any).id = token;
            this.loginStorageService.storeSessionInfo(sessionInfo);
          }
        });
      } else {
        console.log('Token not refreshed ' + new Date());
      }
    }).catch(err => {
      console.log('Failed to refresh token: ' + err);
    });
  }

  private startAutoUpdateToken(minutes: number) {
      if (!this.timer) {
        this.timer = setInterval(() => this.updateToken(), minutes * 60000);
      }
  }

  private stopAutoUpdateToken() {
      if (this.timer) {
        clearInterval(this.timer);

        this.timer = undefined;
      }
  }
}
