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
  protected _userSalavatCount?: number;

  @property({ type: Number })
  protected _userSalavatCountIncrease?: number;

  @property({ type: Number })
  protected _sliderMax?: number;

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
      margin-top: 1rem;
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

  protected shouldUpdate(_changedProperties: PropertyValues) {
    return super.shouldUpdate(_changedProperties) && this.active;
  }

  protected render(): TemplateResult {
    this._log('render');
    const countSum: number = (this._userSalavatCount || 0) + (this._userSalavatCountIncrease || 0);
    return html`
      <div class="label">
        <span class="title">صلوات های من:</span>
        <span class="salavat-count-increase" ?hidden="${!this._userSalavatCountIncrease}">(${this._userSalavatCountIncrease?.toLocaleString('fa')})</span>
        <span class="salavat-count">${countSum.toLocaleString('fa')}</span>
      </div>

      <mwc-slider
        dir="ltr"
        .value="${this._userSalavatCount}"
        .min="${1}"
        .max="${this._sliderMax}"
        .step="${this._sliderMax && this._sliderMax > 2_000 ? 100 : 10}"
        @input="${this._onSliderInput}"
        @change="${this._onSliderChange}"
      ></mwc-slider>

      <salavat-counter .active="${this.active}"></salavat-counter>
    `;
  }

  firstUpdated () {
    chatRoom.onPropertyChanged('userSalavatCount', (userSalavatCount: number | unknown) => {
      this._userSalavatCount = userSalavatCount as number;
    });

    chatRoom.onPropertyChanged('userSalavatCountIncrease', (userSalavatCountIncrease: number | unknown) => {
      this._userSalavatCountIncrease = userSalavatCountIncrease as number;
    });

    chatRoom.onPropertyChanged('sliderMax', (sliderMax: number | unknown) => {
      this._sliderMax = sliderMax as number;
    });
  }

  protected _onSliderInput() {
    this._log('_onSliderInput');
    const userSalavatCountIncrease = this._sliderElement.value - (this._userSalavatCount || 0);
    if (!isNaN(userSalavatCountIncrease) && userSalavatCountIncrease >= 0) {
      chatRoom.setProperty('userSalavatCountIncrease', userSalavatCountIncrease);
      navigator.vibrate(10);
    }
  }

  protected _onSliderChange() {
    this._log('_onSliderChange');
    const sliderElement = this._sliderElement;
    const userSalavatCount = this._userSalavatCount || 0;
    if (sliderElement.value < userSalavatCount) {
      sliderElement.value = userSalavatCount;
      chatRoom.setProperty('snackbar', <SnackbarOption>{
        open: true,
        text: 'شما قبلا این تعداد صلوات را نذر کرده‌اید',
      });
    }
    this._onSliderInput();
  }
}
