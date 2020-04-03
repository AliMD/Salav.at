import { html, css, customElement, property, TemplateResult } from 'lit-element';
import { BaseElement } from './base-element';

const layoutConfig = {
  radius: 200,
  stroke: 5,
  circleRadius: 14,
  topCrop: 50,
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
      overflow: visible;
    }

    .curve-line-mask {
      position: relative;
      box-sizing: border-box;
      width: inherit;
      height: ${layoutConfig.radius-layoutConfig.topCrop}px;
      overflow: hidden;
    }

    .curve-line-back,
    .curve-line-progress,
    .circle {
      display: block;
      position: absolute;
      top: ${-layoutConfig.topCrop}px;
      left: 0;
      border-style: solid;
      border-width: ${layoutConfig.stroke}px;
      box-sizing: border-box;
    }

    .curve-line-back,
    .curve-line-progress {
      width: inherit;
      height: ${layoutConfig.radius}px;

      border-top: none;
      border-radius: 0 0 ${layoutConfig.radius}px ${layoutConfig.radius}px;
    }

    .curve-line-back {
      border-color: var(--curve-line-back-color, #eeeeee);
    }

    .circle,
    .curve-line-progress {
      border-color: var(--curve-line-progress-color, #cf7a59);
      animation-duration: 10s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    .curve-line-progress {
      transform-origin: ${layoutConfig.radius}px 0;
      transform: rotate3d(0, 0, 1, 180deg);

      transition: transform 1s;
      will-change: transform;
      animation-name: ani;
    }

    .circle {
      left: ${-layoutConfig.circleRadius+1}px;
      width: ${layoutConfig.circleRadius*2}px;
      height: ${layoutConfig.circleRadius*2}px;

      border-radius: ${layoutConfig.circleRadius}px;
      background-color: var(--curve-line-back-color, #eeeeee);

      transform-origin: ${layoutConfig.radius+layoutConfig.circleRadius-2}px 0;
      transform: rotate3d(0, 0, 1, 1deg);
      animation-name: ani2;
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
