import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatRadioChange, MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { AppConfig, OTranslateService, Util } from 'ontimize-web-ngx';
import { DocsSiteTheme, ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'settings-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsAppearanceComponent  {

  public availableLangs: string[] = [];
  public currentLang: string;
  public availableThemes: DocsSiteTheme[];
  public currentTheme: DocsSiteTheme;
  public darkDefaultMode = false;

  @ViewChild('toggleDark', { static: false })
  private toggleDark: MatSlideToggle;

  constructor(
    private _appConfig: AppConfig,
    private _themeService: ThemeService,
    private _translateService: OTranslateService
  ) {
    this.availableThemes = this._themeService.availableThemes;
    this.currentTheme = this._themeService.currentTheme || this._themeService.getDefaultTheme();
    this.darkDefaultMode = Util.isDefined(this.currentTheme) ? this.currentTheme.isDark : false;
    this.availableLangs = this._appConfig.getConfiguration().applicationLocales;
    this.currentLang = this._translateService.getCurrentLang();

    this._themeService.onThemeUpdate.subscribe(theme => this.currentTheme = theme);
  }

  changeLang(e: MatRadioChange): void {
    if (this._translateService && this._translateService.getCurrentLang() !== e.value) {
      this._translateService.use(e.value);
    }
  }

  changeTheme(e: MatRadioChange): void {
    e.value.isDark = this.toggleDark.checked;
    this._themeService.installTheme(e.value);
  }

  changeDarkMode(e: MatSlideToggleChange): void {
    const currentTheme = this._themeService.getStoredTheme();
    currentTheme.isDark = e.checked;
    this._themeService.installTheme(currentTheme);
  }

}
