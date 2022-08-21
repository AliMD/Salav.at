import {css, html} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {AppElement} from '../app-debt/app-element';
import {developerTeam} from '../config';

import type {ListenerInterface} from '@alwatr/signal';
import type {TemplateResult, CSSResult} from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'page-about': PageAbout;
  }
}

/**
 * APP PWA About Page Element
 *
 * ```html
 * <page-about></page-about>
 * ```
 */
@customElement('page-about')
export class PageAbout extends AppElement {
  static override styles = [
    ...(<CSSResult[]>AppElement.styles),
    css`
      ion-avatar {
        background-color: #fff;
        --ion-padding: 6px;
      }
      h1 {
        font-size: 18px;
        font-weight: 900;
        margin: auto 12px auto 0;
      }
    `,
  ];

  protected _listenerList: Array<unknown> = [];

  override connectedCallback(): void {
    super.connectedCallback();
    // this._listenerList.push(router.signal.addListener(() => this.requestUpdate()));
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._listenerList.forEach((listener) => (listener as ListenerInterface<keyof AlwatrSignals>).remove());
  }
  override render(): TemplateResult {
    return html`
      <section>
        <div class="box">
          <ion-row>
            <ion-col class="ion-padding-bottom" size="12">
              <ion-avatar class="ion-padding">
                <img src="/images/icon-144x144.png" />
              </ion-avatar>
              <ion-text color="dark">
                <h1>${this._localize.term('spy_game_web_app')}</h1>
              </ion-text>
            </ion-col>
          </ion-row>

          ${this._renderDeveloperTeamList()}
        </div>
      </section>
    `;
  }

  protected _renderDeveloperTeamList(): TemplateResult {
    const developerTeamTemplate = developerTeam.map(
        (developer) => html`
        <ion-item href=${ifDefined(developer.link)} target="_blank">
          <ion-avatar slot="start">
            <img src=${developer.image} />
          </ion-avatar>
          <ion-label>
            <h3>${this._localize.term(developer.name)}</h3>
            <p>${this._localize.term(developer.description)}</p>
          </ion-label>
        </ion-item>
      `,
    );
    return html`
      <ion-list lines="full">
        <ion-list-header>${this._localize.term('developer_team')}</ion-list-header>
        ${developerTeamTemplate}
      </ion-list>
    `;
  }
}
