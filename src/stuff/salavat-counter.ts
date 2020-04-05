import { html, css, customElement, property, TemplateResult, PropertyValues, query } from 'lit-element';
import { BaseElement } from './base-element';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';

const commaSeparator: string = (1000).toLocaleString('fa').charAt(1);

@customElement('salavat-counter')
export class SalavatCounter extends BaseElement {
  @property({ type: String, attribute: 'label-before' })
  labelBefore: string = '';

  @property({ type: String, attribute: 'label-after' })
  labelAfter: string = '';

  @property({ type: Number, attribute: false })
  protected _value: number = 10000;

  @property({ type: Number })
  rate: number = 3;

  @property({ type: Number })
  minWidth: number = 110;

  @property({ type: Number })
  updateInterval: number = 500;

  @query('.value')
  protected _valueElement?: HTMLElement;

  get value (): number {
    return this._value;
  }

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
      transition-timing-function: ease-in-out;
    }

    :host([animate]) {
      transition-duration: 2s;
    }

    .label {
      word-spacing: -4px;
      font-size: 1.4rem;
      font-weight: 300;
      text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);
    }

    .label.before {
      text-align: right;
      margin-right: 15px;
    }

    .label.after {
      text-align: left;
    }

    .value {
      display: inline-block;
      font-size: 5rem;
      font-size: 1.8rem;
      font-size: 5rem;
      font-weight: 500;
      /* border: 1px dashed gray; */
    }

    .comma {
      color: var(--app-accent-color, #a11);
    }
  `];

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <div class="label before">${this.labelBefore}</div>
      <div class="value">
        <!--  -->
        ${this._styledValue}
        <!--  -->
      </div>
      <div class="label after">${this.labelAfter}</div>
    `;
  }

  protected get _styledValue(): Array<TemplateResult | string> {
    const valueArrayString: string[] = this._value.toLocaleString('fa').split(commaSeparator);
    if (valueArrayString.length < 2) {
      return valueArrayString;
    }
    const valueArrayHtml: Array<TemplateResult | string> = []
    for (let i=0; i < valueArrayString.length-1; i++) {
      valueArrayHtml.push(valueArrayString[i]);
      valueArrayHtml.push(html`<span class="comma">${commaSeparator}</span>`);
    }
    valueArrayHtml.push(valueArrayString.pop() as string);
    return valueArrayHtml;
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._log('firstUpdated');
    this._computeValueInterval();
    await this.updateComplete;
    setTimeout(() => this.setAttribute('animate', ''), this.updateInterval*2);
  }

  protected _computeValueInterval() {
    this._log('_computeValueInterval');
    this.computeValue();
    idlePeriod.run(() => setTimeout(() => this._computeValueInterval(), this.updateInterval))
  }

  computeValue() {
    this._log('computeValue');
    this._value ++;
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this._log('updated');
    this.computeMargin();
  }

  async computeMargin(): Promise<void> {
    if (!this._valueElement) return;
    this._log('computeWidth');

    const elementWidth: number = this.getBoundingClientRect().width;
    let valueWidth: number = this._valueElement.getBoundingClientRect().width;
    valueWidth = this._round(valueWidth);

    if (valueWidth < this.minWidth) {
      valueWidth = this.minWidth;
    }
    else if (valueWidth > elementWidth) {
      valueWidth = elementWidth;
    }

    const margin = (elementWidth - valueWidth) / 2;
    this.style.paddingLeft = this.style.paddingRight = margin > 0 ? `${margin}px` : '0';
  }

  _round (number, step: number = 20) {
    return Math.ceil(number / step) * step;
  }
}
