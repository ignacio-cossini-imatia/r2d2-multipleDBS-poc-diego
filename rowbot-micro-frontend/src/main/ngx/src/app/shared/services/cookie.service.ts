import { DOCUMENT } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import { CookieService as CKService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class CookieService {
  private domain: string;

  constructor(private injector: Injector, private cookieService: CKService) {
  }

  public delete(name: string) {
    this.cookieService.delete(name, '/', this.getDomain());
  }

  public get(name: string): string {
    const value = this.cookieService.get(name);
    
    return (value && value !== '') ? value : undefined;
  }

  public set(name: string, value: string) {
    this.cookieService.set(name, value, { path: '/', domain: this.getDomain() });
  }

  private getDomain() {
    if (!this.domain) {
      const document = this.injector.get(DOCUMENT);

      if (document) {
        let list = document.location.hostname.split('.');
        if (list.length > 1) {
          this.domain = list[list.length - 2] + '.' + list[list.length - 1];
        } else if (list.length > 0) {
          this.domain = list[0];
        }
      }
    }

    return this.domain;
  }
}
