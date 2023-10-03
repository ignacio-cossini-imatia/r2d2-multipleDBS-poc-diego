import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CookieService } from 'ngx-cookie-service';
import { APP_CONFIG, LoginStorageService, ONTIMIZE_MODULES, ONTIMIZE_PROVIDERS, OntimizeWebModule, O_MAT_ERROR_OPTIONS } from 'ontimize-web-ngx';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CONFIG } from './app.config';
import { MainService } from './shared/services/main.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { StyleManager } from './shared/services/style-manager';
import { ThemeService } from './shared/services/theme.service';

import { KeycloakAngularModule } from 'keycloak-angular';
import { initializer } from './util/app-init';
import { TenantInterceptor } from './shared/tenant-interceptor';
import { KeycloakService } from './shared/services/keycloak.service';

// Standard providers...
// Defining custom providers (if needed)...
export const customProviders: any = [
  StyleManager,
  ThemeService,
  MainService,
  { provide: O_MAT_ERROR_OPTIONS, useValue: { type: 'lite' } },
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
];

@NgModule({
  imports: [
    ONTIMIZE_MODULES,
    OntimizeWebModule,
    AppRoutingModule,

    HttpClientModule,
    KeycloakAngularModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_CONFIG, useValue: CONFIG },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService, LoginStorageService]
    },
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true },
    ONTIMIZE_PROVIDERS,
    ...customProviders
  ],
})
export class AppModule { }
