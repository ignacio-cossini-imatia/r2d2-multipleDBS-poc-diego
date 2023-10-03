import { Config } from 'ontimize-web-ngx';
import { environment } from '../environments/environment';
import { MENU_CONFIG } from './shared/app.menu.config';
import { SERVICE_CONFIG } from './shared/app.services.config';
import { MultitenantService } from './shared/services/multitenant.service';

export function getEnvVariable(name: string, defaultvalue: string) {
  let result: string = defaultvalue;

  if (window['__env'] !== undefined && window['__env'][name] !== undefined && window['__env'][name] !== null && window['__env'][name] !== "") {
    result = window['__env'][name];
  }

  return result;
}

export function getRecoverPasswordUrl() {
  return getEnvVariable('recoverPasswordUrl', environment.recoverPasswordUrl);
}

export const CONFIG: Config = {
  // The base path of the URL used by app services.
  apiEndpoint:  getEnvVariable('apiUrl', environment.apiEndpoint),

  // Application identifier. Is the unique package identifier of the app.
  // It is used when storing or managing temporal data related with the app.
  // By default is set as 'ontimize-web-uuid'.
  uuid: 'com.imatia.implatform.imatiaspd',

  // Title of the app
  title: 'JEE seed',

  // Language of the application.
  locale: 'es',

  // The service type used (Ontimize REST standart, Ontimize REST JEE
  // or custom implementation) in the whole application.
  serviceType: MultitenantService,

  // Configuration parameters of application services.
  servicesConfiguration: SERVICE_CONFIG,

  appMenuConfiguration: MENU_CONFIG,

  applicationLocales: ['es', 'en']
};
