import {router} from '@alwatr/router';
import {SignalInterface} from '@alwatr/signal';
import {registerTranslation} from '@shoelace-style/localize/dist/index.js';
import {css, html, nothing} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';

import '@erbium/iconsax';
import 'pwa-helper-components/pwa-install-button.js';

import {AppElement} from './app-debt/app-element';
import {mainNavigation} from './config';
import en from './translation/en';
import fa from './translation/fa';
import LocaleController from './utilities/locale-controller';
import registerSW from './utilities/register-sw';
import ThemeController from './utilities/theme-controller';

import './pages/page-home';
import './pages/page-game';
import './pages/page-settings';
import './pages/page-about';

import type {RoutesConfig} from '@alwatr/router';
import type {ListenerInterface} from '@alwatr/signal';
import type {TemplateResult, CSSResult} from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'app-index': AppIndex;
  }
}

/**
 * APP PWA Root Element
 *
 * ```html
 * <app-index></app-index>
 * ```
 */
@customElement('app-index')
export class AppIndex extends AppElement {
  static override styles = [
    ...(<CSSResult[]>AppElement.styles),
    css`
      :host {
        inset: 0;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        position: absolute;
        flex-direction: column;
        justify-content: space-between;
        contain: layout size style;
        overflow: hidden;
        z-index: 0;
      }
      .page-container {
        position: relative;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0%;
        contain: size layout style;
      }
      ion-tab-bar {
        height: 56px;
      }
      ion-tab-button {
        letter-spacing: 0;
        font-size: 12px;
        font-weight: 400;
      }
      /* This will be displayed only on lazy loading. */
      [unresolved]::after {
        content: '...';
        display: block;
        font-size: 2em;
        padding-top: 30vh;
        letter-spacing: 3px;
        text-align: center;
      }
    `,
  ];

  constructor() {
    super();
    router.initial();
  }

  protected _hideNavigation = true;
  protected _hideNavigationSignal = new SignalInterface('hide-navigation');
  protected _serviceWorkerUpdate = new SignalInterface('sw-update');
  protected _localeController = new LocaleController();
  protected _themeController = new ThemeController();
  protected _activePage = 'home';
  protected _listenerList: Array<unknown> = [];

  protected _routes: RoutesConfig = {
    // TODO: refactor route, we need to get active page!
    // TODO: ability to redirect!
    map: (route) => (this._activePage = route.sectionList[0]?.toString().trim() || 'home'),
    list: {
      home: {
        render: () => html`<page-home class="ion-page"></page-home>`,
      },
      game: {
        render: () => html`<page-game class="ion-page"></page-game>`,
      },
      settings: {
        render: () => html`<page-settings class="ion-page"></page-settings>`,
      },
      about: {
        render: () => html`<page-about class="ion-page"></page-about>`,
      },
    },
  };

  override connectedCallback(): void {
    super.connectedCallback();

    registerTranslation(en, fa);
    registerSW();

    this._listenerList.push(
        router.signal.addListener(
            (route) => {
              this._logger.logMethodArgs('routeChanged', {route});
              this._activePage = route.sectionList[0]?.toString().trim() || 'home';
              this.requestUpdate();
            },
            {receivePrevious: true},
        ),
        this._hideNavigationSignal.addListener((_hideNavigation) => {
          const oldValue = this._hideNavigation;
          this._hideNavigation = _hideNavigation;
          this.requestUpdate('_hideNavigation', oldValue);
        }),
    );

    this._hideNavigationSignal.dispatch(false);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._listenerList.forEach((listener) => (listener as ListenerInterface<keyof AlwatrSignals>).remove());
  }
  override render(): TemplateResult {
    return html`
      ${this._renderHeader()}
      <main class="page-container">${router.outlet(this._routes)}</main>
    `;
  }
  override firstUpdated(): void {
    document.body.classList.remove('unresolved');
  }

  protected _renderHeader(): TemplateResult | typeof nothing {
    if (this._hideNavigation) return nothing;

    const BackIconDirection: 'left' | 'right-1' = this._localize.dir() === 'ltr' ? 'right-1' : 'left';

    const listTemplate =
      router.currentRoute.sectionList[0] === 'game' ?
        html`
            <ion-button href="${router.makeUrl({sectionList: []})}">
              <er-iconsax slot="icon-only" name="arrow-${BackIconDirection}" category="outline"></er-iconsax>
            </ion-button>
          ` :
        mainNavigation.map((item) => {
          const selected = this._activePage === item.id;
          return html`
              <ion-button href="${router.makeUrl({sectionList: [item.id]})}" ?hidden="${selected}">
                <er-iconsax slot="icon-only" name="${item.icon}" category="outline"></er-iconsax>
              </ion-button>
            `;
        });

    return html`
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title slot="start">${this._localize.term('spy_game')}</ion-title>

          <ion-buttons slot="primary">${listTemplate}</ion-buttons>

          <ion-buttons slot="end">
            <pwa-install-button>
              <ion-button>
                <er-iconsax slot="icon-only" name="import" category="broken"></er-iconsax>
              </ion-button>
            </pwa-install-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
    `;
  }
}
