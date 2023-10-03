import { Component } from '@angular/core';
import { Util } from 'ontimize-web-ngx';
import { ThemeService } from './shared/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'o-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private _themeService: ThemeService,
    private router: Router
  ) {
    if(window['__ontimize'] !== undefined && window['__ontimize']['redirect'] !== undefined) {
      let redirectTo = window['__ontimize']['redirect'];
      window['__ontimize']['redirect'] = undefined;
      this.router.navigate([redirectTo]);
    }

    const theme = this._themeService.getStoredTheme();
    if (!Util.isDefined(theme)) {
      this._themeService.currentTheme = this._themeService.getDefaultTheme();
      this._themeService.storeTheme(this._themeService.currentTheme);
    } else {
      this._themeService.installTheme(theme);
    }
  }

}
