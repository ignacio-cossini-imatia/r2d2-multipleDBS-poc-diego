import { KeycloakService } from '../shared/services/keycloak.service';

export function initializer(keycloakService: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return keycloakService.initialize();
  };
}
