import {css, html} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';

import {AppElement} from '../app-debt/app-element';
import {locales, themeColors} from '../config';
import LocaleController from '../utilities/locale-controller';
import ThemeController from '../utilities/theme-controller';

import '../components/circle-color';

import type {color} from '../config';
import type {ListenerInterface} from '@alwatr/signal';
import type {TemplateResult, CSSResult} from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-settings': PageSettings;
  }
}

/**
 * Settings Page Element
 * ```html
 * <page-settings></page-settings>
 * ```
 */
@customElement('page-settings')
export class PageSettings extends AppElement {
  static override styles = [
    ...(<CSSResult[]>AppElement.styles),
    css`
      ion-segment-button {
        min-height: 38px;
      }
    `,
  ];

  protected _themeController = new ThemeController();
  protected _localeController = new LocaleController();
  protected _listenerList: Array<unknown> = [];

  override connectedCallback(): void {
    super.connectedCallback();
    // this._listenerList.push(router.signal.addListener(() => this.requestUpdate()));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._listenerList.forEach((listener) => (listener as ListenerInterface<keyof AlwatrSignals>).remove());
  }

  override render(): TemplateResult {
    return html`
      <section>
        <div class="box">
          <ion-row class="ion-padding-bottom">
            <ion-col size="2" class="start">
              <ion-text color="dark">
                <er-iconsax name="language-square" category="outline"></er-iconsax>
              </ion-text>
            </ion-col>
            <ion-col size="6" class="start">
              <ion-text color="dark"> ${this._localize.term('language')}: </ion-text>
            </ion-col>
            <ion-col size="4" class="start">
              <ion-text color="dark"> ${this._localeController.locale.$code} </ion-text>
            </ion-col>
            <ion-col size="12" class="ion-no-padding"> ${this._renderLanguageSelectTemplate()} </ion-col>
          </ion-row>
          <ion-row class="ion-padding-bottom">
            <ion-col size="2" class="start">
              <ion-text color="dark">
                <er-iconsax name="layer" category="outline"></er-iconsax>
              </ion-text>
            </ion-col>
            <ion-col size="6" class="start">
              <ion-text color="dark"> ${this._localize.term('theme_mode')}: </ion-text>
            </ion-col>
            <ion-col size="4" class="start">
              <ion-text color="dark"> ${this._localize.term(this._themeController.mode)} </ion-text>
            </ion-col>
            <ion-col size="12" class="ion-no-padding"> ${this._renderThemeModeSelectTemplate()} </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="2" class="start">
              <ion-text color="dark">
                <er-iconsax name="brush-2" category="outline"></er-iconsax>
              </ion-text>
            </ion-col>
            <ion-col size="6" class="start">
              <ion-text color="dark"> ${this._localize.term('theme_color')}: </ion-text>
            </ion-col>
            <ion-col size="4" class="start">
              <ion-text color="dark"> ${this._localize.term(this._themeController.color)} </ion-text>
            </ion-col>
            <ion-col size="12" class="ion-no-padding"> ${this._renderThemeColorSelectTemplate()} </ion-col>
          </ion-row>
        </div>
      </section>
    `;
  }

  protected _renderLanguageSelectTemplate(): TemplateResult {
    const localesTemplate = locales.map(
        (locale) => html`
        <ion-segment-button @click=${(): void => this._languageChange(locale.code)} value=${locale.code}>
          <ion-label>${locale.$code}</ion-label>
        </ion-segment-button>
      `,
    );

    return html` <ion-segment value=${this._localeController.locale.code}> ${localesTemplate} </ion-segment> `;
  }
  protected _renderThemeColorSelectTemplate(): TemplateResult {
    const themeColorsTemplate = themeColors.map((themeColor) => {
      const isActive = themeColor.name === this._themeController.color;

      return html`
        <circle-color
          color1="${themeColor.colorPrimary}"
          color2="${themeColor.colorPrimaryContrast}"
          @click=${(): void => this._themeColorChange(themeColor.name)}
          ?active=${isActive}
        ></circle-color>
      `;
    });

    return html`<ion-row class="ion-justify-content-center">${themeColorsTemplate}</ion-row>`;
  }
  protected _renderThemeModeSelectTemplate(): TemplateResult {
    return html`
      <ion-segment value=${this._themeController.mode}>
        <ion-segment-button @click=${(): void => this._themeModeChange('light')} value="light">
          <er-iconsax name="sun-1" category="outline"></er-iconsax>
        </ion-segment-button>
        <ion-segment-button @click=${(): void => this._themeModeChange('dark')} value="dark">
          <er-iconsax name="moon" category="outline"></er-iconsax>
        </ion-segment-button>
      </ion-segment>
    `;
  }

  protected _languageChange(code: 'fa' | 'en'): void {
    const locale = locales.find((locale) => locale.code === code);
    if (locale) {
      this._logger.logProperty('locale', locale);
      this._localeController.locale = locale;

      this._localeController.update();
      this.requestUpdate();
    }
  }
  protected _themeColorChange(color: color): void {
    this._themeController.color = color;

    this._themeController.update();
    this.requestUpdate();
  }
  protected _themeModeChange(mode: 'dark' | 'light'): void {
    this._themeController.mode = mode;

    this._themeController.update();
    this.requestUpdate();
  }
}
