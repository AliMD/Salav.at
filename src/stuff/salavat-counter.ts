import { html, css, customElement, property, TemplateResult } from 'lit-element';
import { BaseElement } from './base-element';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
const oneDigitWith = 43;
@customElement('salavat-counter')
export class SalavatCounter extends BaseElement {
  @property({ type: String, attribute: 'label-before' })
  protected labelFirst: string = '';

  @property({ type: String, attribute: 'label-after' })
  protected labelEnd: string = '';

  @property({ type: Number })
  protected value: number = Math.floor(Math.random() * 1_000_000);

  @property({ type: Number })
  protected rate: number = 3;

  static styles = [css`
    :host {
      display: block;
      margin: 0 auto;
      line-height: 1;
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
  `];

  protected render(): TemplateResult {
    this._log('render');
    const value: string = this.value.toLocaleString('fa');
    this.style.width = `${value.length * oneDigitWith}px`;
    return html`
      <div class="label before">${this.labelFirst}</div>
      <div class="value">
        ${value}
      </div>
      <div class="label after">${this.labelEnd}</div>
    `;
  }

  updated () {
    idlePeriod.run(()=>{
      this.value ++;
    });
  }
}
