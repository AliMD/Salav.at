import {router} from '@alwatr/router';
import {html, TemplateResult, PropertyValues} from 'lit';
import {state, query} from 'lit/decorators.js';
import {customElement} from 'lit/decorators/custom-element.js';


import {AppElement} from './app-debt/app-element';
import {styleConfig, pageListArray, MenuItem, safeAreaInsetTop} from './config';
import {styleAppLayout} from './stylesheets/style-app-layout';
import {styleAppResponsive} from './stylesheets/style-app-responsive';
import {chatRoom} from './utilities/chat-room';

import type {RoutesConfig} from '@alwatr/router';
import type {Drawer} from '@material/mwc-drawer';
import type {IconButton} from '@material/mwc-icon-button';

import './components/snack-bar';
import './pages/page-home';
import './pages/page-404';
import './pages/page-about';
import './pages/page-campaign';
import './pages/page-desktop';
import '@material/mwc-button';

declare global {
  interface HTMLElementTagNameMap {
    'salavat-pwa': SalavatPWA;
  }
}

@customElement('salavat-pwa')
export class SalavatPWA extends AppElement {
  @state()
  protected _page = '';

  @state()
  protected _showSubmit = false;

  @state()
  protected _userSalavatCount = 0;

  @query('mwc-drawer')
  protected _drawer!: Drawer;

  protected _menuListArray: MenuItem[] = pageListArray.filter((menuItem) => menuItem.sideMenu) as MenuItem[];

  static override styles = [styleConfig, styleAppLayout, styleAppResponsive];

  constructor() {
    super();

    router.initial();

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

    if (safeAreaInsetTop > 0) {
      // @TODO: fix
      // eslint-disable-next-line wc/no-constructor-attributes
      this.setAttribute('has-notch', 'true');
    }
  }

  protected _activePage = 'home';

  protected _routes: RoutesConfig = {
    // TODO: refactor route, we need to get active page!
    // TODO: ability to redirect!
    map: (route) => (this._activePage = route.sectionList[0]?.toString().trim() || 'home'),
    list: {
      home: {
        render: () => html`<page-home></page-home>`,
      },
      about: {
        render: () => html`<page-about></page-about>`,
      },
      campaign: {
        render: () => html`<page-campaign></page-campaign>`,
      },
      404: {
        render: () => html`<page-404></page-404>`,
      },
    },
  };

  protected _listenerList: Array<unknown> = [];

  protected override render(): TemplateResult {
    this._logger.logMethod('render');
    return html`
      <div class="page-container">${router.outlet(this._routes)}</div>
      <page-desktop></page-desktop>
      <snack-bar></snack-bar>
    `;
  }

  protected override updated(): void {
    this._logger.logMethod('updated');
    const iconButtonList: NodeListOf<IconButton> = this.renderRoot.querySelectorAll('mwc-icon-button');
    for (let i = iconButtonList.length - 1; i >= 0; i--) {
      const internalIcon = iconButtonList.item(i).renderRoot.querySelector<HTMLElement>('.material-icons');
      if (internalIcon) {
        internalIcon.style.display = 'none';
      }
    }
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this._logger.logMethod('firstUpdated');

    chatRoom.onPropertyChanged('sideMenuOpened', (sideMenuOpened: boolean | unknown) => {
      if (!(this._drawer && this._drawer.open != sideMenuOpened)) return;
      this._drawer.open = Boolean(sideMenuOpened);
    });

    chatRoom.onMessage('gotoPage', (page: string | unknown) => {
      const homeLink = this.renderRoot.querySelector<HTMLElement>(`a[href="/${page}"]`);
      this._logger.logMethodArgs('changePageTo2', {page, homeLink});
      if (homeLink) homeLink.click();
    });
  }
}
