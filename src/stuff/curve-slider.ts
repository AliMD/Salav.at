import { html, css, customElement, property, TemplateResult } from 'lit-element';
import { BaseElement } from './base-element';

const layoutConfig = {
  radius: 150,
  stroke: 3,
  circleRadius: 7,
};

@customElement('curve-slider')
export class CurveSlider extends BaseElement {
  @property({ type: Number })
  protected min: Number = 0;

  @property({ type: Number })
  protected max: Number = 0;

  @property({ type: Number })
  protected value: Number = 0;

  static styles = [css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
      width: ${layoutConfig.radius*2}px;
      height: ${layoutConfig.radius}px;
    }

    .curve-line-mask {
      position: relative;
      width: inherit;
      height: inherit;
      overflow: hidden;
      box-sizing: border-box;
    }

    .curve-line-back,
    .curve-line-progress,
    .circle {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      border-style: solid;
      border-width: ${layoutConfig.stroke}px;
      box-sizing: border-box;
    }

    .curve-line-back,
    .curve-line-progress {
      width: inherit;
      height: inherit;

      border-top: none;
      border-radius: 0 0 ${layoutConfig.radius}px ${layoutConfig.radius}px;
    }

    .curve-line-back {
      border-color: var(--curve-line-back-color, #eeeeee);
    }

    .curve-line-progress {
      transform-origin: ${layoutConfig.radius}px 0;
      transform: rotate3d(0, 0, 1, 180deg);

      border-color: var(--curve-line-progress-color, #cf7a59);
      transition: transform 1s;
      will-change: transform;

      animation-name: ani;
      animation-duration: 5s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    .circle {
      left: ${-layoutConfig.circleRadius}px;
      width: ${layoutConfig.circleRadius*2}px;
      height: ${layoutConfig.circleRadius*2}px;

      border-radius: ${layoutConfig.circleRadius}px;
      border-color: var(--curve-line-progress-color, #cf7a59);
      background-color: var(--curve-line-back-color, #eeeeee);

      transform-origin: ${layoutConfig.radius + layoutConfig.circleRadius}px 0;
      transform: rotate3d(0, 0, 1, 1deg);

      animation-name: ani2;
      animation-duration: 5s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    @keyframes ani {
      from {transform: rotate3d(0, 0, 1, 180deg);}
      to {transform: rotate3d(0, 0, 1, 0deg);}
    }

    @keyframes ani2 {
      from {transform: rotate3d(0, 0, 1, 1deg);}
      to {transform: rotate3d(0, 0, 1, -176deg);}
    }
  `];

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <div class="curve-line-mask">
        <div class="curve-line-back"></div>
        <div class="curve-line-progress"></div>
      </div>
      <div class="circle"></div>
    `;
  }
}
