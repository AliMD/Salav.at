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
  protected labelFirst: string = '';

  @property({ type: String, attribute: 'label-after' })
  protected labelEnd: string = '';

  @property({ type: Number })
  protected value: number = 8888;

  @property({ type: Number })
  protected rate: number = 3;

  static styles = [css`
    :host {
      display: block;
      margin: 0 auto;
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
    const value: string = this.value.toLocaleString('fa');
    const width = value.length * oneDigitWith;
    const marginLeft = width < minWidth ? (minWidth - width) / 2 + 'px' : '0';
    this.style.width = `${width < minWidth ? minWidth : width}px`;
    return html`
      <div class="label before">${this.labelFirst}</div>
      <div class="value" style="${styleMap({ marginLeft })}">
        ${this.styleValue()}
      </div>
      <div class="label after">${this.labelEnd}</div>
    `;
  }

  styleValue(): Array<TemplateResult | string> {
    const valueArrayString: string[] = this.value.toLocaleString('fa').split(commaSeparator);
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

  firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._computeValueInterval();
  }

  protected _computeValueInterval () {
    this._log('_computeValueInterval');
    idlePeriod.run(() => {
      this.value += Math.floor(Math.random() * 100);
      this._computeValueInterval();
    });
  }

  computeValue() {
    this._log('computeValue');
    this.value += Math.floor(Math.random() * 100);
  }
}
