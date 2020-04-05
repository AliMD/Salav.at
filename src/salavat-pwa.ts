import { html, customElement, property, TemplateResult, query, PropertyValues } from 'lit-element';
import '@material/mwc-icon-button';
import { IconButton } from '@material/mwc-icon-button';
import '@material/mwc-drawer';
import { Drawer } from '@material/mwc-drawer';

import './director';
import './stuff/curve-slider';
import { BaseElement } from './stuff/base-element';
import { chatRoom } from './stuff/chat-room';
import { styleConfig } from './config';
import { styleAppLayout } from './stuff/style-app-layout';
import { menuIcon, heartIcon, getAppIcon } from './stuff/icon';

@customElement('salavat-pwa')
export class SalavatPWA extends BaseElement {
  @property({ type: String })
  protected page: string = '';

  @query('mwc-drawer')
  drawer: Drawer | undefined;

  static styles = [styleConfig, styleAppLayout];

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
      <mwc-drawer type="modal" @MDCDrawer:closed="${() => { chatRoom.setProperty('sideMenuOpened', false); }}">
        <div class="drawer-content">
          <p>Here We go Here We go</p>
        </div>
        <div slot="appContent">
          <mwc-icon-button class="menu-button" @click="${() => { chatRoom.setProperty('sideMenuOpened', true); }}">${menuIcon}</mwc-icon-button>
          <div class="main-image">
            <div class="submit-button"></div>
          </div>
          <curve-slider></curve-slider>
          <main role="main">
          </main>
          <div class="footer-text"><span>Made with love</span>${heartIcon}</div>
          <mwc-icon-button class="get-app-button">${getAppIcon}</mwc-icon-button>
        </div>
      </mwc-drawer>
    `;
  }

  protected updated() {
    this._log('updated');
    const iconButtonList: NodeListOf<IconButton> = this.renderRoot.querySelectorAll('mwc-icon-button');
    for (let i = iconButtonList.length-1; i >= 0; i--) {
      const internalIcon = iconButtonList.item(i).renderRoot.querySelector<HTMLElement>('.material-icons');
      if (internalIcon) {
        internalIcon.style.display = 'none';
        this._log('Remove mwc-icon-button internal material-icon element!');
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this._log('firstUpdated');

    chatRoom.onPropertyChanged('sideMenuOpened', (sideMenuOpened: boolean | unknown) => {
      if (!(this.drawer && this.drawer.open != sideMenuOpened)) return;
      this.drawer.open = Boolean(sideMenuOpened);
    });
  }
}
