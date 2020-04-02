import { html, css, customElement, property, TemplateResult } from 'lit-element';
import { BaseElement } from './base-element';

@customElement('curve-slider')
export class CurveSlider extends BaseElement {
  @property({ type: Number })
  protected min: Number = 0;

  static styles = [css`
    :host {
      display: block;
      width: 300px;
      height: 150px;
      margin: 2em auto;
      position: relative;
    }

    .mask {
      width: inherit;
      height: inherit;
      overflow: hidden;
      position: relative;
    }

    .box1,
    .box2 {
      position: absolute;
      top:0;
      left:0;
      box-sizing: border-box;
      width: inherit;
      height: inherit;
      border: 3px solid lightblue;
      border-top: none;
      border-radius: 0 0 150px 150px;
    }

    .box2 {
      border-color: blue;
      transform-origin: 150px 0;
      /* transition: transform 1s; */
      animation-name: ani;
      animation-duration: 5s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    }

    .circle {
      position: absolute;
      top: 0px;
      left:-7px;
      width: 15px;
      height: 15px;
      box-sizing: border-box;
      border: 3px solid blue;
      background-color: #fff;
      border-radius: 50%;
      transform-origin: 156px 0;
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
      <div class="mask">
        <div class="box1"></div>
        <div class="box2"></div>
      </div>
      <div class="circle"></div>
    `;
  }
}
