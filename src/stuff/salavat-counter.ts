import { html, css, customElement, property, TemplateResult, PropertyValues } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { BaseElement } from './base-element';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';

const oneDigitWith = 42;
const minWidth = 150;
const commaSeparator = (1000).toLocaleString('fa').charAt(1);

@customElement('salavat-counter')
export class SalavatCounter extends BaseElement {
  @property({ type: String, attribute: 'label-before' })
  labelBefore: string = '';

  @property({ type: String, attribute: 'label-after' })
  labelAfter: string = '';

  @property({ type: Number, attribute: false })
  protected _value: number = 8888;

  @property({ type: Number })
  rate: number = 3;

  get value (): number {
    return this._value;
  }

  static styles = [css`
    :host {
      display: block;
      line-height: 1;
      white-space: nowrap;
      text-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12);
    }

    .label {
      word-spacing: -4px;
      font-size: 1.4rem;
      font-weight: 300;
      text-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);
    }

    .label.before {
      text-align: right;
    }

    .label.after {
      text-align: left;
    }

    .value {
      text-align: left;
      font-size: 5rem;
      font-size: 1.8rem;
      font-size: 5rem;
      font-weight: 500;
    }

    .comma {
      color: var(--app-accent-color, #a11);
    }
  `];

  protected render(): TemplateResult {
    this._log('render');
    const value: string = this._value.toLocaleString('fa');
    const width = value.length * oneDigitWith;
    const marginLeft = width < minWidth ? (minWidth - width) / 2 + 'px' : '0';
    this.style.width = `${width < minWidth ? minWidth : width}px`;
    return html`
      <div class="label before">${this.labelBefore}</div>
      <div class="value" style="${styleMap({ marginLeft })}">
        ${this._styledValue}
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

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._computeValueInterval();
  }

  protected _computeValueInterval () {
    this._log('_computeValueInterval');
    idlePeriod.run(() => {
      this._value += Math.floor(Math.random() * 100);
      this._computeValueInterval();
    });
  }

  computeValue() {
    this._log('computeValue');
    this._value += Math.floor(Math.random() * 100);
  }
}
