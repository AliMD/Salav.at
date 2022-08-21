import {createLogger} from '@alwatr/logger';
import {update as localizeUpdate} from '@shoelace-style/localize/dist/index';
import {notEqual} from 'lit';

import {locales} from '../config';

import type {locale} from '../config';

class LocaleController {
  html?: HTMLElement;
  protected _logger = createLogger('controller/locale');

  constructor() {
    this.update();
  }

  get locale(): locale {
    const localeString = window.localStorage.getItem('i18nLocale');

    if (!localeString) {
      this.locale = locales[0];
      return this.locale;
    }

    return <locale>JSON.parse(localeString);
  }
  set locale(_locale: locale) {
    window.localStorage.setItem('i18nLocale', JSON.stringify(_locale));
  }

  update(): void {
    const HTMLElement = document.querySelector('html');

    if (!HTMLElement) return;

    this.html = HTMLElement;
    let isChanged = false;

    if (notEqual(this.locale.code, this.html.lang)) {
      this.html.lang = this.locale.code;
      isChanged = true;
    }
    if (notEqual(this.locale.dir, this.html.dir)) {
      this.html.dir = this.locale.dir;
      isChanged = true;
    }

    if (isChanged) {
      localizeUpdate();
      this._logger.logMethodArgs('update', {language: this.locale.code, direction: this.locale.dir});
    }
  }
}

export default LocaleController;
