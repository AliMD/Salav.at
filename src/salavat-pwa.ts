import { html, customElement, property, TemplateResult, query, PropertyValues } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { IconButton } from '@material/mwc-icon-button';
import '@material/mwc-drawer';
import { Drawer } from '@material/mwc-drawer';

import './director';
import './stuff/snack-bar';
import './stuff/page-home';
import { BaseElement } from './stuff/base-element';
import { chatRoom } from './stuff/chat-room';
import { styleConfig, pageListArray, MenuItem } from './config';
import { styleAppLayout } from './stuff/style-app-layout';
import { menuIcon, heartIcon, getAppIcon, plusIcon } from './stuff/icon';

@customElement('salavat-pwa')
export class SalavatPWA extends BaseElement {
  @property({ type: String })
  protected _page: string = '';

  @property({ type: Boolean })
  protected _showSubmit: boolean = false;

  @property({ type: Number })
  protected _userSalavatCount: number = 0;

  @query('mwc-drawer')
  protected _drawer!: Drawer;

  protected _menuListArray: MenuItem[] = pageListArray.filter(menuItem => menuItem.sideMenu) as MenuItem[];

  static styles = [styleConfig, styleAppLayout];

  constructor() {
    super();

    chatRoom.onPropertyChanged('page', (pageName: string | unknown) => {
      if (!(typeof pageName === 'string')) return;
      this._page = pageName;
    });

    chatRoom.onPropertyChanged('showSubmit', (showSubmit: boolean | unknown) => {
      this._showSubmit = Boolean(showSubmit);
    });

    chatRoom.onPropertyChanged('userSalavatCount', (userSalavatCount: number | unknown) => {
      this._userSalavatCount = userSalavatCount as number;
    });
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <mwc-drawer type="modal" @MDCDrawer:closed="${() => chatRoom.setProperty('sideMenuOpened', false) }">
        <div class="drawer-content">
          <div class="salavat-badge">
            <div class="title">صلوات های من:</div>
            <div class="number">${(this._userSalavatCount || 0).toLocaleString('fa')}</div>
          </div>
          <div class="menu">
            ${this._menuListArray.map((menuItem) => html`
              <a href="/${menuItem.slug}">
                <mwc-button fullwidth>
                  <div class="button-content">${menuItem.title} ${menuItem.icon}</div>
                </mwc-button>
              </a>
            `)}
          </div>
          <div class="gap"></div>
          <a class="drawer-footer" href="https://github.com/AliMD/Salav.at" target="_blank">Salav.at Beta v0.5</a>
        </div>
        <div slot="appContent" page="${this._page}">
          <mwc-icon-button
            class="menu-button"
            @click="${() => chatRoom.setProperty('sideMenuOpened', true) }"
          >
            ${menuIcon}
          </mwc-icon-button>
          <div class="main-image">
            <div class="submit-button" ?show="${this._showSubmit}" @click=${() => chatRoom.postMessage('submit-salavat')}>
              <mwc-icon-button>${plusIcon}</mwc-icon-button>
            </div>
          </div>
          <main role="main">
            <page-home ?active="${this._page === 'home'}"></page-home>
            <div class="page" ?active="${this._page === 'about'}">
              About page ....
              <!-- TODO: design about page -->
            </div>
            <!-- TODO: add other page like about ... -->
            <div class="page" ?active="${this._page === '404'}">
              Page not found ...
              <!-- TODO: design simple 404 page -->
            </div>
          </main>
          <div
            class="footer-text"
            @click="${() => chatRoom.setProperty('snackbar', { open: true, text: 'ساخته شده با عشق' })}"
          >
            <span>Made with</span>${heartIcon}
          </div>
          <mwc-icon-button class="get-app-button" @click="${() => this._showSubmit = !this._showSubmit}">${getAppIcon}</mwc-icon-button>
        </div>
      </mwc-drawer>
      <snack-bar></snack-bar>
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
      if (!(this._drawer && this._drawer.open != sideMenuOpened)) return;
      this._drawer.open = Boolean(sideMenuOpened);
    });
  }
}
