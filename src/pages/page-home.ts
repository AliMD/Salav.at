import {router} from '@alwatr/router';
import {SignalInterface} from '@alwatr/signal';
import {pickerController} from '@ionic/core';
import {html} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';
import {range} from 'lit/directives/range.js';

import {AppElement} from '../app-debt/app-element';

import type {ListenerInterface} from '@alwatr/signal';
import type {TemplateResult, CSSResult} from 'lit';

import '@erbium/iconsax';

declare global {
  interface HTMLElementTagNameMap {
    'page-home': PageHome;
  }
}

/**
 * APP PWA Home Page Element
 *
 * ```html
 * <page-home></page-home>
 * ```
 */
@customElement('page-home')
export class PageHome extends AppElement {
  static override styles = [...(<CSSResult[]>AppElement.styles)];

  protected _settings: settings = {players: 3, spies: 1, time: 5};
  protected _listenerList: Array<unknown> = [];
  protected _settingsSignal = new SignalInterface('game-settings');
  protected _wordsSignal = new SignalInterface('game-words');

  override connectedCallback(): void {
    super.connectedCallback();
    this._wordsSignal.dispatch(<string[]> this._localize.term('words'));
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
          <ion-row>
            <ion-col size="2" class="center">
              <ion-text color="dark">
                <er-iconsax name="people" category="broken"></er-iconsax>
              </ion-text>
            </ion-col>
            <ion-col size="4" class="start">
              <ion-text color="dark"> ${this._localize.term('number_of_players')}:</ion-text>
            </ion-col>
            <ion-col size="6" class="center">
              <ion-button
                color="dark"
                expand="block"
                fill="outline"
                @click=${(): Promise<void> => this._changeSettings('players')}
              >
                <er-iconsax class="select__opt-icon" name="arrow-down" category="bold" slot="end"></er-iconsax>
                <ion-label slot="start">
                  ${this._localize.number(this._settings.players)} ${this._localize.term('$players_unit')}
                </ion-label>
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="2" class="center">
              <ion-text color="dark">
                <er-iconsax name="user-remove" category="broken"></er-iconsax>
              </ion-text>
            </ion-col>
            <ion-col size="4" class="start">
              <ion-text color="dark"> ${this._localize.term('number_of_spies')}: </ion-text>
            </ion-col>
            <ion-col size="6" class="center">
              <ion-button
                color="dark"
                expand="block"
                fill="outline"
                @click=${(): Promise<void> => this._changeSettings('spies')}
              >
                <er-iconsax class="select__opt-icon" name="arrow-down" category="bold" slot="end"></er-iconsax>
                <ion-label slot="start">
                  ${this._localize.number(this._settings.spies)} ${this._localize.term('$spies_unit')}
                </ion-label>
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="2" class="center">
              <ion-text color="dark">
                <er-iconsax name="timer-1" category="broken"></er-iconsax>
              </ion-text>
            </ion-col>
            <ion-col size="4" class="start">
              <ion-text color="dark"> ${this._localize.term('time')}: </ion-text>
            </ion-col>
            <ion-col size="6" class="center">
              <ion-button
                color="dark"
                expand="block"
                fill="outline"
                @click=${(): Promise<void> => this._changeSettings('time')}
              >
                <er-iconsax class="select__opt-icon" name="arrow-down" category="bold" slot="end"></er-iconsax>
                <ion-label slot="start">
                  ${this._localize.number(this._settings.time)} ${this._localize.term('$time_unit')}
                </ion-label>
              </ion-button>
            </ion-col>
          </ion-row>
          <ion-row class="ion-padding-top">
            <ion-col size="12">
              <ion-button
                color=${this._startButtonStyle.color}
                ?disabled="${this._startButtonStyle.disabled}"
                @click="${this._startGame}"
              >
                ${this._startButtonStyle.text}
              </ion-button>
            </ion-col>
          </ion-row>
        </div>
      </section>
    `;
  }

  protected async _changeSettings(setting: 'spies' | 'players' | 'time'): Promise<void> {
    let rangeArray: number[] = Array(...range(30));

    switch (setting) {
      case 'players':
        rangeArray = Array(...range(3, 31));
        break;
      case 'spies':
        rangeArray = Array(...range(1, 16));
        break;
      case 'time':
        rangeArray = Array(...range(5, 46, 5));
        break;
    }

    const picker = await pickerController.create({
      cssClass: 'settings__select',
      columns: [
        {
          name: setting,
          prefix: this._localize.term(`$${setting}_unit`),
          selectedIndex: rangeArray.indexOf(this._settings[setting]),
          options: rangeArray.map((number: number) => ({
            text: this._localize.number(number),
            value: number,
          })),
        },
      ],
      buttons: [
        {
          text: this._localize.term('ok'),
          handler: (value: {[setting: string]: {text: string; value: number}}): boolean => {
            this._settings[setting] = value[setting].value;
            this.requestUpdate();
            return true;
          },
        },
        {text: this._localize.term('cancel'), role: 'cancel'},
      ],
    });

    await picker.present();
  }
  protected _startGame(): void {
    this._settingsSignal.dispatch(this._settings);
    if (!this._wordsSignal.dispatched) {
      return;
    }

    router.signal.request({pathname: router.makeUrl({sectionList: ['game']})});
  }

  protected get _startButtonStyle(): {
    text: string;
    color: 'primary' | 'danger' | 'warning' | 'success';
    disabled: boolean;
    } {
    const playersRatio = Math.round(this._settings.players / 3);
    const isDisabled = Math.round(this._settings.players / 2) <= this._settings.spies;

    if (playersRatio === this._settings.spies) {
      return {text: this._localize.term('all_settings_are_good'), color: 'success', disabled: isDisabled};
    } else if (playersRatio >= this._settings.spies) {
      return {text: this._localize.term('the_citizen_is_more_likely_to_win'), color: 'warning', disabled: isDisabled};
    } else if (playersRatio <= this._settings.spies) {
      return {text: this._localize.term('the_spy_is_more_likely_to_win'), color: 'danger', disabled: isDisabled};
    }
    return {text: this._localize.term('all_settings_are_good'), color: 'primary', disabled: isDisabled};
  }
}
