import {LitElement, html, css, nothing} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';
import {property} from 'lit/decorators/property.js';

import type {TemplateResult} from 'lit';

@customElement('circle-color')
export class CircleColor extends LitElement {
  static override styles = [
    css`
      * {
        box-sizing: border-box;
      }
      :host {
        display: inline-block;
        padding: 4px;
      }
      :host([active]) .circle {
        padding: 3px;
        border: 2px solid;
      }
      .circle {
        display: flex;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        transition: border 100ms ease, padding 100ms ease;
      }
      .color-parts {
        display: flex;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
      }
      .color-part {
        display: flex;
        height: 100%;
        flex-grow: 1;
      }
    `,
  ];

  @property() color1 = '#000';
  @property() color2?: string;

  override render(): TemplateResult {
    return html`
      <div class="circle" style="border-color:${this.color1};">
        <div class="color-parts">${this._renderColorPart(this.color1)}${this._renderColorPart(this.color2)}</div>
      </div>
    `;
  }

  protected _renderColorPart(color?: string): TemplateResult | typeof nothing {
    if (!color) return nothing;

    return html`<span class="color-part" style="background-color:${color};"></span>`;
  }
}
