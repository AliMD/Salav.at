import { html, css, customElement, property, TemplateResult } from 'lit-element';
import '@material/mwc-icon-button';

import './director';
import { BaseElement } from './base-element';
import { chatRoom } from './chat-room';
import { styleConfig, appConfig } from './stuff/config';
import { styleAppLayout } from './stuff/style-app-layout';
import { menuIcon, heartIcon, getAppIcon } from './stuff/icon';

@customElement('salavat-pwa')
export class SalavatPWA extends BaseElement {
  @property({ type: String })
  protected page: string = '';

  static styles = [styleConfig, styleAppLayout, css`
    :host {
      display: block;
      font-size: 1rem;
      box-sizing: border-box;
      min-height: 100vh;
      background-color: var(--app-primary-color);
      overflow: hidden;
      user-select: none;
    }

    @media screen and (min-width: ${appConfig.maxWith}px) {
      :host {
        position: relative;
        max-width: ${appConfig.maxWith}px;
        min-height: 800px;
        margin: 1em auto;
        border-radius: 15px;
        /* box-shadow: 1px 2px 4px 0px black; */
        animation-direction: alternate;
      }
    }
  `];

  constructor () {
    super();

    chatRoom.onPropertyChanged('page', (pageName: string | unknown) => {
      if (!(typeof pageName === 'string')) return;
      this.page = pageName;
    });
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <mwc-icon-button class="menu-button">${menuIcon}</mwc-icon-button>
      <div class="main-image">
        <div class="submit-button"></div>
      </div>
      <main role="main">
        <!-- <page-home class="page" ?active="${this.page === 'home'}"></page-home> -->
        Content page ${this.page} ...
      </main>

      <div class="footer-text"><span>Made with love</span>${heartIcon}</div>
      <mwc-icon-button class="get-app-button">${getAppIcon}</mwc-icon-button>
    `;
  }

  // protected firstUpdated(_changedProperties: PropertyValues) {
  //   super.firstUpdated(_changedProperties);
  //   this._log('firstUpdated');

  //   chatRoom.onPropertyChanged('sideMenuOpened', (sideMenuOpened: boolean | unknown) => {
  //     TODO:
  //   });
  // }
}
