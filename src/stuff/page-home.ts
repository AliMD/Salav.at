import { customElement, TemplateResult, html, PropertyValues, property, css, query } from 'lit-element';
import '@material/mwc-slider';
import { Slider } from'@material/mwc-slider';

import { BaseElement } from './base-element';
import './salavat-counter';
import { appConfig } from '../config';
import { chatRoom } from './chat-room';
import { SnackbarOption } from './snack-bar';

@customElement('page-home')
export class PageHome extends BaseElement {
  @property({ type: Boolean })
  protected active: boolean = false;

  @property({ type: Number })
  protected _userSalavatCount: number = 0;

  @property({ type: Number })
  protected _userSalavatCountIncrease: number = 0;

  @property({ type: Number })
  protected _sliderMax: number = 1000;

  @query('mwc-slider')
  protected _sliderElement!: Slider;

  static styles = css`
    :host {
      display: none;
      padding-top: 0.5rem
    }

    :host([active]) {
      display: block;
    }

    mwc-slider {
      display: block;
      margin: 0 ${appConfig.mainImageMargin}px;
    }

    salavat-counter {
      margin: 1rem;
    }

    .label {
      text-align: center;
      text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);
    }

    .salavat-count,
    .salavat-count-increase {
      font-weight: 500;
      font-size: 1.3rem;
    }

    .salavat-count-increase {
      font-size: 1.2rem;
      color: var(--app-accent-color);
    }
  `;

  constructor () {
    super();
    this._log('constructor');

    chatRoom.onPropertyChanged('userSalavatCount', (userSalavatCount: number | unknown) => {
      this._userSalavatCount = userSalavatCount as number;
      // if (this._userSalavatCount === this._sliderMax) {
      //   this._sliderMax *= 3;
      // }
    });

    chatRoom.onPropertyChanged('userSalavatCountIncrease', (userSalavatCountIncrease: number | unknown) => {
      this._userSalavatCountIncrease = userSalavatCountIncrease as number;
    });
  }

  protected shouldUpdate(_changedProperties: PropertyValues) {
    return super.shouldUpdate(_changedProperties) && this.active;
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <mwc-slider
        dir="ltr"
        ?pin="${this._userSalavatCount < 100}"
        .value="${this._userSalavatCount}"
        min="1"
        max="${this._sliderMax}"
        step="10"
        @input="${this._onSliderInput}"
        @change="${this._onSliderChange}"
      ></mwc-slider>
      <div class="label">
        <span class="title">صلوات های من:</span>
        <span class="salavat-count-increase" ?hidden="${!this._userSalavatCountIncrease}">${this._userSalavatCountIncrease.toLocaleString('fa')}<span class="plus">+</span></span>
        <span class="salavat-count">${this._userSalavatCount.toLocaleString('fa')}</span>
      </div>
      <salavat-counter
        .debug="${false}"
        .active="${this.active}"
        label-before="تا این لحظه"
        label-after="صلوات نذر شده"
      >
      </salavat-counter>
    `;
  }

  protected _onSliderInput() {
    this._log('_onSliderInput');
    const userSalavatCountIncrease = this._sliderElement.value - this._userSalavatCount;
    if (userSalavatCountIncrease >= 0) {
      chatRoom.setProperty('userSalavatCountIncrease', userSalavatCountIncrease);
    }
  }

  protected _onSliderChange() {
    this._log('_onSliderChange');
    if (this._sliderElement.value < this._userSalavatCount) {
      this._sliderElement.value = this._userSalavatCount;
      chatRoom.setProperty('snackbar', <SnackbarOption>{
        open: true,
        text: 'شما قبلا این تعداد صلوات را نذر کرده‌اید'
      });
    }
    this._onSliderInput();
  }
}
