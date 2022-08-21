import {TemplateResult, html, PropertyValues} from 'lit';
import {query} from 'lit/decorators.js';
import {customElement} from 'lit/decorators/custom-element.js';

import {AppElement} from '../app-debt/app-element';
import {appConfig} from '../config';
import {chatRoom} from '../utilities/chat-room';
import {closeIcon} from './icon';

import type {Snackbar} from '@material/mwc-snackbar';

import '@material/mwc-button';

export interface SnackbarOption {
  open: boolean;
  reason?: string;
  text?: string;
  timeout?: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'snack-bar': SnackBar;
  }
}

@customElement('snack-bar')
export class SnackBar extends AppElement {
  @query('mwc-snackbar')
  snackbar: Snackbar | undefined;

  protected override render(): TemplateResult {
    this._logger.logMethod('render');
    return html`
      <mwc-snackbar leading labelText="متن فارسی نمونه ...">
        <!-- <mwc-button slot="action">خب</mwc-button> -->
        <mwc-icon-button slot="dismiss">${closeIcon}</mwc-icon-button>
      </mwc-snackbar>
    `;
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this._logger.logMethod('firstUpdated');

    chatRoom.onPropertyChanged('snackbar', (snackbarOption: SnackbarOption | unknown) => {
      if (!(this.snackbar && snackbarOption && 'open' in (snackbarOption as SnackbarOption))) return;
      const _snackbarOption = snackbarOption as SnackbarOption;
      this.snackbar.labelText = _snackbarOption.text || '';
      this.snackbar.timeoutMs = _snackbarOption.timeout || appConfig.snackbarTimeout;
      this.snackbar.open = _snackbarOption.open;
    });
  }
}
