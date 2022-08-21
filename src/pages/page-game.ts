import {random} from '@alwatr/math';
import {router} from '@alwatr/router';
import {SignalInterface} from '@alwatr/signal';
import {css, html, nothing} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';

import {AppElement} from '../app-debt/app-element';
import '../components/spy-timer';

import type {ListenerInterface} from '@alwatr/signal';
import type {TemplateResult, CSSResult} from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-game': PageGame;
  }
}

/**
 * APP PWA Home Page Element
 *
 * ```html
 * <page-game></page-game>
 * ```
 */
@customElement('page-game')
export class PageGame extends AppElement {
  static override styles = [
    ...(<CSSResult[]>AppElement.styles),
    css`
      section .box .game-next {
        display: flex;
        justify-content: center;
        width: 100%;
        padding-top: 24px;
      }
      section .box .game-next ion-button {
        width: 100%;
      }
    `,
  ];

  protected _listenerList: Array<unknown> = [];
  protected _settingsSignal = new SignalInterface('game-settings');
  protected _wordsSignal = new SignalInterface('game-words');
  protected _words: string[] = [];
  protected _wordActive = 0;
  protected _hideWord = true;
  protected _showTime = false;
  protected _timeSeconds = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this._settingsSignal.value === undefined || this._wordsSignal.value === undefined) {
      this._goToHomePage();
    } else {
      const game = this._settingsSignal.value;
      const nodeWords = this._wordsSignal.value;
      const word = nodeWords[Math.floor(Math.random() * nodeWords.length)];
      const words = [];

      for (let i = 0; i < game.players - game.spies; i++) {
        words.push(word);
      }
      for (let i = 0; i < game.spies; i++) {
        words.push('spy');
      }

      this._words = random.shuffle(words).map((word) => (word === 'spy' ? this._localize.term('spy') : word));
    }
    // this._listenerList.push(router.signal.addListener(() => this.requestUpdate()));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._settingsSignal.dispatch(undefined);
    this._listenerList.forEach((listener) => (listener as ListenerInterface<keyof AlwatrSignals>).remove());
  }

  override render(): TemplateResult {
    return html`
      <section>
        <div class="box">${this._render()}</div>
      </section>
    `;
  }

  protected _renderWord(): TemplateResult {
    return html`
      <ion-text color="dark">
        <h1 class="ion-text-center">${this._words[this._wordActive]}</h1>
      </ion-text>
      <div class="game-next">
        <ion-grid>
          <ion-row>
            <ion-col size="12">
              <ion-button color="danger" @click="${this._hide}">${this._localize.term('hide')}</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    `;
  }
  protected _renderHideCover(): TemplateResult {
    return html`
      <ion-text color="dark">
        <h1 class="ion-text-center">${this._localize.term('next_person')}</h1>
      </ion-text>
      <div class="game-next">
        <ion-grid>
          <ion-row>
            <ion-col size="3"> </ion-col>
            <ion-col size="6">
              <ion-button color="warning" @click="${this._show}">
                <ion-label>${this._localize.term('show_word')} </ion-label>
              </ion-button>
            </ion-col>
            <ion-col size="1"> </ion-col>
            <ion-col size="2" style="align-items: flex-end;justify-content: flex-end;display: flex;">
              <ion-note>
                ${this._localize.number(this._wordActive + 1)}/${this._localize.number(this._words.length)}
              </ion-note>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    `;
  }
  protected _renderStartCover(): TemplateResult {
    return html`
      <ion-text color="dark">
        <h1 class="ion-text-center">${this._localize.term('start')}</h1>
      </ion-text>
      <div class="game-next">
        <ion-grid>
          <ion-row>
            <ion-col size="3"> </ion-col>
            <ion-col size="6">
              <ion-button @click="${this._show}">
                <ion-label>${this._localize.term('show_word')}</ion-label>
              </ion-button>
            </ion-col>
            <ion-col size="1"> </ion-col>
            <ion-col size="2" style="align-items: flex-end;justify-content: flex-end;display: flex;">
              <ion-note>
                ${this._localize.number(this._wordActive + 1)}/${this._localize.number(this._words.length)}
              </ion-note>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    `;
  }
  protected _renderTimer(): TemplateResult {
    return html`
      <ion-text color="dark">
        <h1 class="ion-text-center">
          <spy-timer duration="${this._timeSeconds}"></spy-timer>
        </h1>
      </ion-text>
      <div class="game-next">
        <ion-grid>
          <ion-row>
            <ion-col size="12">
              <ion-button @click="${this._goToHomePage}">${this._localize.term('back')}</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    `;
  }
  protected _render(): TemplateResult | typeof nothing {
    if (this._showTime) return this._renderTimer();
    if (!this._showTime && this._hideWord && this._wordActive === 0) return this._renderStartCover();
    if (!this._showTime && this._hideWord) return this._renderHideCover();
    if (!this._showTime && !this._hideWord) return this._renderWord();

    return nothing;
  }

  protected _goToHomePage(): void {
    router.signal.request({pathname: '/'});
  }
  protected _show(): void {
    this._hideWord = !this._hideWord;
    this.requestUpdate();
  }
  protected _hide(): void {
    this._hideWord = !this._hideWord;
    if (this._words.length - 1 > this._wordActive) {
      this._wordActive++;
    } else {
      const _timeMinutes = this._settingsSignal.value?.time;
      this._timeSeconds = _timeMinutes !== undefined ? _timeMinutes * 60 + 1 : 0;
      this._showTime = true;
    }
    this.requestUpdate();
  }
}
