import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { KeycloakAuthGuard } from 'keycloak-angular';
import { Codes, PermissionsService, ServiceResponse, OUserInfoService } from 'ontimize-web-ngx';
import { MainService } from './services/main.service';
import { UserInfoService } from './services/user-info.service';
import { KeycloakService } from './services/keycloak.service';

@Injectable( )
export class AppAuthGuard extends KeycloakAuthGuard {
  constructor(protected router: Router,
      protected keycloakService: KeycloakService,
      protected permissionsService: PermissionsService,
      protected mainService : MainService,
      protected oUserInfoService: OUserInfoService,
      protected userInfoService: UserInfoService,
      protected domSanitizer: DomSanitizer
    ) {
    super(router, keycloakService.getKeycloak());
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (this.keycloakService.getKeycloak().getKeycloakInstance()) {
      return await super.canActivate(route, state);
    } else {
      this.router.navigate([Codes.LOGIN_ROUTE], {queryParams: {'redirect':state.url}});
    }
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.authenticated !== true) {
      this.router.navigate([Codes.LOGIN_ROUTE], {queryParams: {'redirect':state.url}});
      return;
    }

    console.log('*************** ' + route);

    return new Promise(async (resolve, reject) => {
      let granted = false;

      await this.loadPermissions();

      console.log('Role restriction given at app-routing.module for this route', route.data.roles);
      console.log('User roles coming after login from keycloak :', this.roles);
      const requiredRoles = route.data.roles;
      if (!requiredRoles || requiredRoles.length === 0) {
        granted = true;
      } else {
        for (const requiredRole of requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;
            break;
          }
        }
      }

      if (granted === true) {
        this.loadUserInfo();
      } else {
        this.router.navigate(['/']);
      }

      resolve(granted);
    });
  }

  private loadPermissions(): Promise<boolean> {
    if (!this.permissionsService.hasPermissions()) {
      return this.permissionsService.getUserPermissionsAsPromise();
    }
  }

  private loadUserInfo() {
    this.mainService.getUserInfo()
      .subscribe((result: ServiceResponse) => {
        if (result && result.data) {
          this.userInfoService.storeUserInfo(result.data);
          let avatar = './assets/images/user_profile.png';
          if (result.data['usr_photo']) {
            (avatar as any) = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + result.data['usr_photo']);
          }
          this.oUserInfoService.setUserInfo({
            username: result.data['usr_name'],
            avatar: avatar
          });
        }
      });
  }

  /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.permissionsService.hasPermissions()) {
      return this.permissionsService.getUserPermissionsAsPromise();
    }
  }*/

}
