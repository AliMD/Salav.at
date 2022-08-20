import {html, css, TemplateResult, PropertyValues} from 'lit';
import {query, property} from 'lit/decorators.js';
import {customElement} from 'lit/decorators/custom-element.js';


import {SalavatCountInterface} from '../config';
import {BaseElement} from './base-element';
import {chatRoom} from './chat-room';

const commaSeparator: string = (1_000).toLocaleString('fa').charAt(1);
const minWidth = 120;
const firstAnimateGap = 20;

@customElement('salavat-counter')
export class SalavatCounter extends BaseElement {
  @property({type: Boolean})
    active = false;

  @property({type: Boolean, attribute: false})
    testMode = true;

  @property({type: Number, attribute: false})
    count?: number; // Real salavat count

  @property({type: Number, attribute: false})
    displayCount?: number;

  @query('.display-count')
  protected _displayCountElement?: HTMLElement;

  static override styles = [
    css`
      :host {
        display: block;
        line-height: 1;
        box-sizing: border-box;
        white-space: nowrap;
        text-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
        text-align: left;
        will-change: padding;
        transition-property: padding;
        transition-duration: 0;
        transition-timing-function: linear;
        direction: ltr;
      }

      :host([animate]) {
        transition-duration: 700ms;
      }

      .label {
        word-spacing: -4px;
        font-size: 1.4rem;
        font-weight: 300;
        text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);
        direction: rtl;
      }

      .label.before {
        text-align: right;
        margin-right: 10px;
      }

      .label.after {
        text-align: left;
      }

      .display-count {
        display: inline-block;
        font-size: 5rem;
        font-size: 1.8rem;
        font-size: 5rem;
        font-weight: 700;
        /* border: 1px dashed gray; */
      }

      .comma {
        color: var(--app-accent-color, #a11);
        padding: 0 5px;
      }

      .highlight {
        color: var(--app-accent-color, #a11);
      }
    `,
  ];

  constructor() {
    super();
    this._logger.logMethod('constructor');

    chatRoom.onPropertyChanged('salavatCount', async (salavatCount: SalavatCountInterface | unknown) => {
      if (!salavatCount) return;
      const _salavatCount = salavatCount as SalavatCountInterface;
      this.count = _salavatCount.count;
    });

    chatRoom.onPropertyChanged('testMode', (testMode: boolean | unknown) => {
      this.testMode = Boolean(testMode);
    });

    chatRoom.onMessage('skipCountAnimation', () => {
      this.displayCount = this.count;
    });
  }

  protected override shouldUpdate(_changedProperties: PropertyValues): boolean {
    return super.shouldUpdate(_changedProperties) && this.active;
  }

  protected override render(): TemplateResult {
    // this._log('render');
    return html`
      <div class="label before">تا این لحظه</div>
      <div class="display-count">
        <!--  -->
        ${this._styledDisplayCount}
        <!--  -->
      </div>
      ${this.testMode ?
         html` <div class="label after"><span class="highlight">الکی</span> تست شده</div> ` :
         html`<div class="label after">صلوات نذر شده</div>`}
    `;
  }

  protected get _styledDisplayCount(): Array<TemplateResult | string> {
    if (this.displayCount == undefined) return ['...'];
    const countArrayString: string[] = this.displayCount.toLocaleString('fa').split(commaSeparator);
    if (countArrayString.length < 2) {
      return countArrayString;
    }
    const countArrayHtml: Array<TemplateResult | string> = [];
    for (let i = 0; i < countArrayString.length - 1; i++) {
      countArrayHtml.push(countArrayString[i]);
      countArrayHtml.push(html`<span class="comma">${commaSeparator}</span>`);
    }
    countArrayHtml.push(countArrayString.pop() as string);
    return countArrayHtml;
  }

  protected override async firstUpdated(_changedProperties: PropertyValues): Promise<void> {
    super.firstUpdated(_changedProperties);
    this._logger.logMethod('firstUpdated');
    chatRoom.onMessage('window-resized', () => {
      this.computePadding();
    });
    setTimeout(async () => {
      // FIXME: why timeout!
      this.computePadding();
      requestIdleCallback(() => this.setAttribute('animate', ''));
    }, 1_000);
  }

  override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    // this._log('updated');
    this.computePadding();

    if (this.displayCount !== this.count) {
      requestAnimationFrame(() => this.computeDisplayCount());
    }
  }

  computeDisplayCount(): void {
    if (!(this.active && this.displayCount !== this.count && this.count != undefined)) return;
    // this._log('computeDisplayCount');
    if (this.displayCount == undefined) {
      // first time
      if (this.count > firstAnimateGap) {
        this.displayCount = this.count - firstAnimateGap;
      } else {
        this.displayCount = 0;
      }
      return;
    }

    const step = Math.ceil(Math.abs(this.count - this.displayCount) / 200);

    if (Math.abs(this.displayCount - this.count) < step) {
      this.displayCount = this.count;
      return;
    }
    // else
    this.displayCount += this.displayCount < this.count ? step : -step;
  }

  computePadding(): void {
    const displayCountElement = this._displayCountElement;
    if (!displayCountElement) return;
    // this._log('computePadding');

    const elementWidth: number = this.getBoundingClientRect().width;
    let countWidth: number = displayCountElement.getBoundingClientRect().width;
    countWidth = this._round(countWidth);

    if (countWidth < minWidth) {
      countWidth = minWidth;
    } else if (countWidth > elementWidth) {
      countWidth = elementWidth;
    }

    const padding = (elementWidth - countWidth) / 2;
    this.style.paddingLeft = this.style.paddingRight = padding > 0 ? `${padding}px` : '0';
  }

  _round(number: number, step = 20): number {
    return Math.ceil(number / step) * step;
  }
}
