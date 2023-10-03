import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginStorageService, NavigationService } from 'ontimize-web-ngx';
import { Observable } from 'rxjs';
import { MainService } from '../shared/services/main.service';
import { KeycloakService } from '../shared/services/keycloak.service';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({});
  public userCtrl: FormControl = new FormControl('', Validators.required);
  public tenantCtrl: FormControl = new FormControl('', Validators.required);

  private sessionExpired = false;
  private status = undefined;
  private redirect = '/main';
  private tenantId = undefined;

  public loading = true;
  public loadingTenants = false;
  public tenants = [];
  public selectedTenant = undefined;
  public selectedUser = undefined;
  public message = undefined;
  public loginError = undefined;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    @Inject(LoginStorageService) public loginStorageService: LoginStorageService,
    @Inject(NavigationService) public navigationService: NavigationService,
    @Inject(MainService) private mainService: MainService,
    @Inject(KeycloakService) private keycloakService: KeycloakService
  ) {
    const qParamObs: Observable<any> = this.actRoute.queryParams;
    qParamObs.subscribe(params => {
      if (params) {
        if (params['session-expired']) {
          this.sessionExpired = (params['session-expired'] === 'true');
        } else if (params['status']) {
          this.status = params['status'];
        } else {
          if (params['redirect']) {
            this.redirect = params['redirect'];
          }
          if (params['tenantId']) {
            this.tenantId = params['tenantId'];
          }
          this.sessionExpired = false;
        }
      }
    });
  }

  ngOnInit(): any {
    this.navigationService.setVisible(false);

    this.loginForm.addControl('username', this.userCtrl);
    this.loginForm.addControl('tenant', this.tenantCtrl);

    if (this.sessionExpired === true) {
      this.message = 'ERROR_SESSION_EXPIRED';
      this.loading = false;
    } else {
      this.keycloakService.isLoggedIn().then((result) => {
        if (result === true) {
          if (this.status === '401' || this.status === '403') {
            this.message = 'MESSAGES.ERROR_403_TEXT';
            this.loading = false;
          } else {
            // Logged in successfully
            this.router.navigate([this.redirect]);
          }
        } else if (this.tenantId && this.tenantId.toString().length >= 0) {
          // The tenant was provided by a query parameter, try to login directly
          this.directLogin(this.tenantId);
        } else  {
          this.loading = false;
        }
      }, (error) => {
        this.loading = false;
      });
    }
  }

  public login() {
    if (!this.selectedTenant || !this.selectedTenant.tenantId || !this.selectedTenant.url || !this.selectedTenant.realm || !this.selectedTenant.client) return;

    this.keycloakService.login(this.selectedTenant.tenantId, this.selectedTenant.url, this.selectedTenant.realm, this.selectedTenant.client,
      this.redirect, this.selectedUser);
  }

  private directLogin(tenantId: string) {
    this.loadingTenants = true;
    this.mainService.getTenantInfo(tenantId).subscribe((resp) => {
      this.loadingTenants = false;

      if (resp) {
        let tenantInfo = JSON.parse(resp.toString());
        if (tenantInfo) {
          this.keycloakService.login(tenantId, tenantInfo.url, tenantInfo.realm, tenantInfo.client, this.redirect);
        }
      }
    });
  }

  private fillTenants(user: any) {
    this.selectedUser = undefined;
    this.selectedTenant = undefined;
    this.tenants = [];

    if (!user || user.toString().length == 0) {
      return;
    }

    this.loadingTenants = true;

    this.mainService.listTenants(user).subscribe((resp) => {
      if (resp) {
        this.selectedUser = user;
        this.tenants = JSON.parse(resp.toString());
        if (this.tenants.length == 0) {
          this.userCtrl.setErrors({ wrong_user: true });
          this.loginError = 'ERROR_NO_ORGANIZATIONS';
        } else if (this.tenants.length == 1) {
          this.selectedTenant = this.tenants[0];
          this.tenantCtrl.setValue(this.selectedTenant);
        }
      }
      this.loadingTenants = false;
    });
  }

  public onUserChange(user: any) {
    if (this.selectedUser !== user) {
      this.loginError = undefined;

      if (this.userCtrl.valid === true) {
        this.fillTenants(user);
      } else {
        this.selectedUser = undefined;
        this.selectedTenant = undefined;
        this.tenants = [];
      }
    }
  }

  public onUserInput(event: any, user: any) {
    if (event.inputType === 'insertReplacementText') {
      this.loginError = undefined;

      if (this.userCtrl.valid === true) {
        this.fillTenants(user);
      }
    }
  }

  public onTenantChange(tenant: any) {
    this.selectedTenant = tenant;
  }

  public buttonDisabled() {
    const isValid = this.selectedUser && this.selectedTenant;
    return !isValid;
  }

  public recoverPassword() {
    window.location.href = this.mainService.getRecoverPasswordUrl(this.selectedUser);
  }
}
