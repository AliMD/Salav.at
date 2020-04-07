import { customElement, TemplateResult, html, PropertyValues, property, css } from 'lit-element';
import '@material/mwc-slider';

import { BaseElement } from './base-element';
import './salavat-counter';
import { appConfig } from '../config';

@customElement('page-home')
export class PageHome extends BaseElement {
  @property({ type: Boolean })
  protected active: boolean = false;

  static styles = css`
    :host {
      display: none;
    }

    :host([active]) {
      display: block;
    }

    mwc-slider {
      display: block;
      margin: 0.5rem ${appConfig.mainImageMargin}px 1rem;
    }

      salavat-counter {
        margin: 0 1rem;
      }
  `;

  protected shouldUpdate(_changedProperties: PropertyValues) {
    return super.shouldUpdate(_changedProperties) && this.active;
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <mwc-slider value="10" min="1" max="114" step="1" pin dir="ltr"></mwc-slider>
      <salavat-counter
        .debug="${false}"
        .active="${this.active}"
        label-before="تا این لحظه"
        label-after="صلوات نذر شده"
      >
      </salavat-counter>
    `;
  }
}
