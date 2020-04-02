import { html, css, customElement, property, TemplateResult } from 'lit-element';
import { BaseElement } from './base-element';

@customElement('curve-slider')
export class CurveSlider extends BaseElement {
  @property({ type: Number })
  protected min: Number = 0;

  static styles = [css`
  `];

  protected render(): TemplateResult {
    this._log('render');
    return html`
    `;
  }
}
