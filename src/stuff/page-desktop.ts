import {customElement, TemplateResult, html, css} from 'lit-element';
import '@material/mwc-slider';

import {BaseElement} from './base-element';
import {salavatIcon, qrCode} from './icon';
import {chatRoom} from './chat-room';

@customElement('page-desktop')
export class PageDesktop extends BaseElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;

      box-sizing: border-box;
      height: 100%;
      padding: 10vh 1rem 0;
      font-weight: 300;
      text-align: center;

      background-image: url("image/background-desktop.jpg");
      background-position-x: right;
      background-position-y: bottom;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .salavat-icon svg {
      width: 250px;
      height: auto;
      fill: var(--app-primary-text-color);
    }

    .message {
      margin: 2rem 0;
      word-spacing: -3px;
      font-size: 1.7rem;
      flex-grow: 1;
      flex-shrink: 1;
    }

    .message p {
      margin: 1rem 0rem;
    }

    .message span {
      color: var(--app-accent-color);
    }

    .qr-code {
      display: block;
      background-color: #fafafa;
      color: #090b2a;
      fill: #090b2a;
      line-height: 14px;
      font-weight: 400;
      padding-bottom: 10px;
    }

    .qr-code svg {
      width: 120px;
      height: auto;
    }

    .link {
      cursor: pointer;
      text-decoration: underline;
    }
  `;

  protected override render(): TemplateResult {
    this._log('render');
    return html`
      <div class="salavat-icon">${salavatIcon}</div>
      <div class="message">
        <p>این برنامه <span>فعلا</span> تنها برای موبایل طراحی شده است.</p>
        <p>لطفا این سایت را در <span>موبایل</span> باز کنید.</p>
        <p>درضمن امکان <span class="link" @click=${this._requestInstall}>
          نصب در دسکتاپ
        </span> را نیز تست کنید.</p>
      </div>
      <div class="qr-code">
        ${qrCode}
        <br/>
        www.Salav.at
      </div>
    `;
  }

  protected _requestInstall(): void {
    chatRoom.postMessage('request-install');
  }
}
