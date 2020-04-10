import { html, css, customElement, property, TemplateResult, PropertyValues, query } from 'lit-element';
import { BaseElement } from './base-element';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
import { chatRoom } from './chat-room';
import { SalavatCountInterface } from '../config';

const commaSeparator: string = (1_000).toLocaleString('fa').charAt(1);
const step = 1;

@customElement('salavat-counter')
export class SalavatCounter extends BaseElement {
  @property({ type: Boolean })
  protected active: boolean = false;

  @property({ type: String, attribute: 'label-before' })
  labelBefore: string = '';

  @property({ type: String, attribute: 'label-after' })
  labelAfter: string = '';

  @property({ type: Number })
  minWidth: number = 120;

  @property({ type: Number })
  count?: number; // Real salavat count

  @property({ type: Number, attribute: false })
  displayCount?: number;

  @query('.display-count')
  protected _displayCountElement?: HTMLElement;

  static styles = [css`
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
    }

    :host([animate]) {
      transition-duration: 500ms;
    }

    .label {
      word-spacing: -4px;
      font-size: 1.4rem;
      font-weight: 300;
      text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);
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
  `];

  constructor () {
    super();
    this._log('constructor');

    chatRoom.onPropertyChanged('salavatCount', (salavatCount: SalavatCountInterface | unknown) => {
      if (!salavatCount) return;
      const _salavatCount = salavatCount as SalavatCountInterface;
      this.count = _salavatCount.count;
    });
  }

  protected shouldUpdate(_changedProperties: PropertyValues) {
    return super.shouldUpdate(_changedProperties) && this.active;
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <div class="label before">${this.labelBefore}</div>
      <div class="display-count">
        <!--  -->
        ${this._styledDisplayCount}
        <!--  -->
      </div>
      <div class="label after">${this.labelAfter}</div>
    `;
  }

  protected get _styledDisplayCount(): Array<TemplateResult | string> {
    if (this.displayCount == undefined) return ['...'];
    const countArrayString: string[] = this.displayCount.toLocaleString('fa').split(commaSeparator);
    if (countArrayString.length < 2) {
      return countArrayString;
    }
    const countArrayHtml: Array<TemplateResult | string> = []
    for (let i=0; i < countArrayString.length-1; i++) {
      countArrayHtml.push(countArrayString[i]);
      countArrayHtml.push(html`<span class="comma">${commaSeparator}</span>`);
    }
    countArrayHtml.push(countArrayString.pop() as string);
    return countArrayHtml;
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._log('firstUpdated');
    chatRoom.onMessage('window-resized', () => {
      this.computePadding();
    });
    setTimeout(() => this.setAttribute('animate', ''), 1_000);
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this._log('updated');
    this.computePadding();

    if (this.displayCount !== this.count) {
      idlePeriod.run(() => this.computeDisplayCount());
    }
  }

  computeDisplayCount () {
    if (!(this.active && this.displayCount !== this.count && this.count != undefined)) return;
    // this._log('computeDisplayCount');

    if (this.displayCount == undefined) {
      this.displayCount = this.count; // first time
      return;
    }
    else if (Math.abs(this.displayCount - this.count) < step) {
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

    if (countWidth < this.minWidth) {
      countWidth = this.minWidth;
    }
    else if (countWidth > elementWidth) {
      countWidth = elementWidth;
    }

    const padding = (elementWidth - countWidth) / 2;
    this.style.paddingLeft = this.style.paddingRight = padding > 0 ? `${padding}px` : '0';
  }

  _round (number, step: number = 20) {
    return Math.ceil(number / step) * step;
  }
}
