import {state, customElement, TemplateResult, html, PropertyValues, property, css, query} from 'lit-element';
import '@material/mwc-slider';
import {Slider} from '@material/mwc-slider';

import {BaseElement} from './base-element';
import './salavat-counter';
import {chatRoom} from './chat-room';
import {calcSliderMax} from '../director';
import {addIcon, removeIcon} from './icon';
import {logger} from '../config';

if (typeof navigator.vibrate !== 'function') {
  navigator.vibrate = (pattern):boolean => !pattern;
}

@customElement('page-home')
export class PageHome extends BaseElement {
  @property({type: Boolean})
    active = false;

  @property({type: Number})
  public userSalavatCount?: number;

  @state()
  protected _userSalavatCountIncrease = 0;

  @state()
  protected _sliderMax = 0;

  @query('mwc-slider')
    _sliderElement!: Slider;

  static override styles = css`
    :host {
      display: none;
      padding-top: 0.5rem;
      --mdc-icon-size: 20px;
      --mdc-icon-button-size: 40px;
    }

    :host([active]) {
      display: block;
    }

    .slider {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0 1em;
    }

    mwc-slider {
      flex-grow: 1;
      margin: 0 6px 1px;
    }

    salavat-counter {
      margin: 1rem;
    }

    mwc-icon-button {
      color: var(--app-accent-color);
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
      /* font-size: 1.2rem; */
      color: var(--app-accent-color);
    }
  `;

  protected override shouldUpdate(_changedProperties: PropertyValues):boolean {
    return super.shouldUpdate(_changedProperties) && this.active;
  }

  protected override render(): TemplateResult {
    logger.logMethod('render');
    return html`
      <div class="label">
        <span class="title">صلوات های من:</span>
        <span class="salavat-count-increase" ?hidden="${!this._userSalavatCountIncrease}">
          ${this._userSalavatCountIncrease?.toLocaleString('fa')}+
        </span>
        <span class="salavat-count">${(this.userSalavatCount || 0).toLocaleString('fa')}</span>
      </div>

      <div class="slider">
        <mwc-icon-button @click="${this._addIconClick}">${addIcon}</mwc-icon-button>
        <mwc-slider
          dir="ltr"
          .value="${this._userSalavatCountIncrease}"
          .min="${1}"
          .max="${this._sliderMax}"
          .step="${this._sliderMax && this._sliderMax > 2_000 ? 10 : 5}"
          @input="${this._onSliderInput}"
          @change="${this._onSliderChange}"
        ></mwc-slider>
        <mwc-icon-button @click="${this._removeIconClick}">${removeIcon}</mwc-icon-button>
      </div>

      <salavat-counter .active="${this.active}"></salavat-counter>
    `;
  }

  override firstUpdated():void {
    chatRoom.onPropertyChanged('userSalavatCount', (userSalavatCount: number | unknown) => {
      this.userSalavatCount = userSalavatCount as number;
    });

    chatRoom.onPropertyChanged('userSalavatCountIncrease', (userSalavatCountIncrease: number | unknown) => {
      this._userSalavatCountIncrease = userSalavatCountIncrease as number;
    });

    chatRoom.onPropertyChanged('sliderMax', (sliderMax: number | unknown) => {
      this._sliderMax = sliderMax as number;
    });
  }

  protected _onSliderInput():void {
    logger.logMethod('_onSliderInput');
    const userSalavatCountIncrease = this._sliderElement.value;
    if (!isNaN(userSalavatCountIncrease) && userSalavatCountIncrease >= 0) {
      chatRoom.setProperty('userSalavatCountIncrease', userSalavatCountIncrease);
      navigator.vibrate(6);
    }
  }

  protected _onSliderChange():void {
    logger.logMethod('_onSliderChange');
    const sliderElement = this._sliderElement;
    // const userSalavatCount = this._userSalavatCount || 0;
    // if (sliderElement.value < userSalavatCount) {
    //   sliderElement.value = userSalavatCount;
    //   chatRoom.setProperty('snackbar', <SnackbarOption>{
    //     open: true,
    //     text: 'شما قبلا این تعداد صلوات را نذر کرده‌اید',
    //   });
    // }
    // else {
    this._onSliderInput();
    calcSliderMax(sliderElement.value);
  }

  protected _addIconClick():void {
    if (!this._userSalavatCountIncrease) {
      this._userSalavatCountIncrease = 0;
    }
    chatRoom.setProperty('userSalavatCountIncrease', this._userSalavatCountIncrease + 1);
    calcSliderMax(this._userSalavatCountIncrease);
    navigator.vibrate(6);
  }

  protected _removeIconClick():void {
    if (!this._userSalavatCountIncrease) {
      this._userSalavatCountIncrease = 0;
    }
    if (this._userSalavatCountIncrease > 0 ) {
      chatRoom.setProperty('userSalavatCountIncrease', this._userSalavatCountIncrease - 1);
    }
    calcSliderMax(this._userSalavatCountIncrease);
    navigator.vibrate(6);
  }
}
