import { html, css, customElement, property, TemplateResult } from 'lit-element';

import './director';
import { BaseElement } from './base-element';
import { chatRoom } from './chat-room';

@customElement('salavat-pwa')
export class SalavatPWA extends BaseElement {
  @property({ type: String })
  protected page: string = '';

  static styles = css`
    :host {
      display: block;

      --app-primary-color: #E91E63;
      --app-section-even-color: #f7f7f7;
      --app-section-odd-color: white;
      --app-header-background-color: white;
      --app-header-text-color: var(--app-dark-text-color);
      --app-header-selected-color: var(--app-primary-color);
      --app-drawer-background-color: var(--app-secondary-color);
      --app-drawer-text-color: var(--app-light-text-color);
      --app-drawer-selected-color: #78909C;

      --drawer-menu-background-color: #FAFAFA;
    }

    * {
      box-sizing: border-box;
    }

    app-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      background-color: var(--app-header-background-color);
      color: var(--app-header-text-color);
      /* border-bottom: 1px solid #eee; */
    }

    app-toolbar {
      display: flex;
      height: 112px;
      padding: 0;
    }

    app-toolbar pazh-header-1 {
      flex-grow: 1;
    }

    [main-title] {
      font-family: 'Pacifico';
      text-transform: lowercase;
      font-size: 30px;
      /* In the narrow layout, the toolbar is offset by the width of the
      drawer button, and the text looks not centered. Add a padding to
      match that button */
      padding-right: 44px;
    }

    /* Workaround for IE11 displaying <main> as inline */
    main {
      display: block;
    }

    .page {
      display: none;
      height: inherit;
    }

    .page[active] {
      display: block;
    }

    .main-content {
      padding-top: 112px;
    }

    footer {
      padding: 0 24px 68px;
    }

    app-drawer {
      z-index: 1000;
      transition: 1s ease-in;
    }

    /* Wide layout: when the viewport width is bigger than 460px, layout
    changes to a wide layout */
    @media (min-width: 600px) {
      :host {
        --app-drawer-width: 320px;
      }

      /* The drawer button isn't shown in the wide layout, so we don't
      need to offset the title */
      [main-title] {
        padding-right: 0px;
      }

      app-toolbar {
        height: 58px;
      }

      .main-content {
        padding-top: 56px;
      }
    }
  `;

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
      <div class="test">j ali kj fj</div>
      <main role="main" class="main-content">
        <!-- <page-home class="page" ?active="${this.page === 'home'}"></page-home> -->
        Content page ${this.page} ...
      </main>

      <footer>
        Made with love ;)
      </footer>
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
