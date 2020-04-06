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
  displayCount: number = 10000;

  @property({ type: Number })
  rate: number = 3;

  @property({ type: Number })
  minWidth: number = 110;

  @property({ type: Number })
  updateInterval: number = 500;

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
    }
  `];

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
    this._computeDisplayCountInterval();
    await this.updateComplete;
    setTimeout(() => this.setAttribute('animate', ''), this.updateInterval*2);
  }

  protected _computeDisplayCountInterval() {
    this._log('_computeDisplayCountInterval');
    this.computeDisplayCount();
    idlePeriod.run(() => setTimeout(() => this._computeDisplayCountInterval(), this.updateInterval))
  }

  computeDisplayCount() {
    this._log('computeDisplayCount');
    this.displayCount ++;
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this._log('updated');
    this.computeMargin();
  }

  async computeMargin(): Promise<void> {
    if (!this._displayCountElement) return;
    this._log('computeWidth');

    const elementWidth: number = this.getBoundingClientRect().width;
    let countWidth: number = this._displayCountElement.getBoundingClientRect().width;
    countWidth = this._round(countWidth);

    if (countWidth < this.minWidth) {
      countWidth = this.minWidth;
    }
    else if (countWidth > elementWidth) {
      countWidth = elementWidth;
    }

    const margin = (elementWidth - countWidth) / 2;
    this.style.paddingLeft = this.style.paddingRight = margin > 0 ? `${margin}px` : '0';
  }

  _round (number, step: number = 20) {
    return Math.ceil(number / step) * step;
  }
}
