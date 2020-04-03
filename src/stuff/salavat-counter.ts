import { html, css, customElement, property, TemplateResult } from 'lit-element';
import { BaseElement } from './base-element';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';

@customElement('salavat-counter')
export class SalavatCounter extends BaseElement {
  @property({ type: String, attribute: 'label-first' })
  protected labelFirst: string = '';

  @property({ type: String, attribute: 'label-end' })
  protected labelEnd: string = '';

  @property({ type: Number })
  protected value: number = 0;

  @property({ type: Number })
  protected rate: number = 3;

  static styles = [css`
    :host {
      display: block;
      font-size: 1.8rem;
    }

    .label-first {
      text-align: right;
    }

    .value {
      text-align: left;
      font-size: 5rem;
    }

    .label-end {
      text-align: left;
    }
  `];

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <div class="label-first">${this.labelFirst}</div>
      <div class="value">${this.value.toLocaleString('fa')}</div>
      <div class="label-end">${this.labelEnd}</div>
    `;
  }

  updated () {
    idlePeriod.run(()=>{
      this.value ++;
    });
  }
}
