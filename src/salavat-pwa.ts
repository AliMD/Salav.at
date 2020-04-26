import { html, customElement, property, TemplateResult, query, PropertyValues } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { IconButton } from '@material/mwc-icon-button';
import '@material/mwc-drawer';
import { Drawer } from '@material/mwc-drawer';

import './director';
import './stuff/snack-bar';
import './stuff/page-home';
import './stuff/page-desktop';
import { BaseElement } from './stuff/base-element';
import { chatRoom } from './stuff/chat-room';
import { styleConfig, pageListArray, MenuItem, appConfig, safeAreaInsetTop } from './config';
import { styleAppLayout } from './stuff/style-app-layout';
import { styleAppResponsive } from './stuff/style-app-responsive';
import { menuIcon, getAppIcon, plusIcon, twitterIcon, instagramIcon, telegramIcon, salavatSmallIcon, downloadIconOutlined } from './stuff/icon';

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

  static styles = [styleConfig, styleAppLayout, styleAppResponsive];

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

    if (safeAreaInsetTop > 0) {
      this.setAttribute('has-notch', 'true');
    }
  }

  protected render(): TemplateResult {
    this._log('render');
    return html`
      <mwc-drawer type="modal" @MDCDrawer:closed="${() => chatRoom.setProperty('sideMenuOpened', false)}">
        <!-- side drawer content -->
        <div class="drawer-content">
          <a href="/" class="salavat-badge">
            <div class="title">صلوات های من:</div>
            <div class="number">${(this._userSalavatCount || 0).toLocaleString('fa')}</div>
          </a>

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

          <div class="social-media">
            <a href="https://instagram.com/salav_at_/" target="_blank">
              <mwc-icon-button>${instagramIcon}</mwc-icon-button>
            </a>
            <a href="https://twitter.com/salav_at_/" target="_blank">
              <mwc-icon-button>${twitterIcon}</mwc-icon-button>
            </a>
            <a href="https://t.me/joinchat/Aw16XEemR8ZuuXgZXdTR1w" target="_blank">
              <mwc-icon-button>${telegramIcon}</mwc-icon-button>
            </a>
          </div>

          <a class="drawer-footer" href="https://github.com/AliMD/Salav.at" target="_blank">Salav.at v${appConfig.appVersion}</a>
        </div>

        <!-- screen content -->
        <div class="app-content" slot="appContent" page="${this._page}">
          <main role="main">
            <div class="main-image">
              <div class="submit-button" ?show="${this._showSubmit}" @click=${() => chatRoom.postMessage('submit-salavat')}>
                <mwc-icon-button>${plusIcon}</mwc-icon-button>
              </div>
            </div>
            <div class="page-container">
              <page-home ?active="${this._page === 'home'}"></page-home>
              <div class="page about text-mode" ?active="${this._page === 'about'}">
                به نظر ما یه سری اتفاقات تو تاریخ موندگار میشه، به این جهت که می تونه کل دنیا رو درگیر خودش کنه. مثل بیماری کرونا که مدتیه درگیرش هستیم.
                هر سال به نیمه شعبان که می‌رسیدیم دور هم جمع می‌شدیم تا بتونیم با گرفتن یه جشن کوچیک،
                شاد باشیم از بودنش،
                شادی کنیم برای داشتنش
                و یادمون بمونه که وظیفه داریم تلاش کنیم برای اومدنش.
                اما کرونا امسال رو برامون متفاوت کرد.
                واسه همین تصمیم گرفتیم نیمه شعبان ۹۹ در بستر فضای مجازی فعالیت کنیم و نتیجش شد همین صلوات‌شماری که می بینید.
                خط به خط کدهای برنامه نویسی "صلوات"،
                پیکسل به پیکسل طراحی های گرافیکی "صلوات"،
                و ثانیه به ثانیه زمان هایی که برای ایجاد این بستر گذاشته شده،
                با عشق و به یاد کسی بوده که منتظریم با اومدنش تمام روزهای بعد از بودنش رو برامون، "با خاطره خوش"، به یادموندنی کنه...
                تقدیم به حجة بن الحسن (عجل الله تعالی فرجه الشریف)
                و
                تموم شهدایی که با فدا کردن جونشون، امروز رو برای بردن اسم اماممون امن کردن...
              </div>
              <div class="page campaign text-mode" ?active="${this._page === 'campaign'}">
                <div>
                  گاهی آنقدر تلخی زندگی‌مان زیاد می شود،که رنگِ خوشِ شادی روزهایمان، در قرنطینه تلخِ روزگار به خاکستری می زند.
                  اما ما یاد گرفته ایم تا دهانمان را با سلام و صلوات بر محمد و آل او شیرین کنیم تا همه چیز با نشاط شود و غم، از زندگی‌مان رخت ببندد.
                  سلامی به شیرینی با تو بودن...
                  به مناسبت ایام پر برکت شعبان و رمضان، تصمیم گرفتیم کمپین نذر "یک میلیون" صلوات به نیت دعا برای سلامتی و ظهور امام زمان (عجل الله تعالی فرجه الشریف) را از میلاد حضرتش تا میلاد کریم اهل‌بیت، حضرت امام حسن مجتبی (علیه السلام) در نیمه رمضان آغاز کنیم.
                  برای هماهنگی و رسیدن به عدد یک میلیون صلوات، خواهشمندیم تعداد صلوات‌های فرستاده شده را در شمارنده وارد کنید.
                  برای حمایت از کمپین، با دانلود و اشتراک‌گذاری پوستر زیر، به همراه منشن کردن پیج اینستاگرامی صلوات
                  <a href="https://instagram.com/salav_at_/" target="_blank">@Salav_at_</a>
                  همراه این کمپین باشید...
                </div>
                <div class="center">
                  <a href="image/salavat-story.jpg" target="_blank" download>
                    <mwc-button>
                      <div class="button-content">${downloadIconOutlined} دانلود استوری</div>
                    </mwc-button>
                  </a>
                </div>
              </div>
              <div class="page" ?active="${this._page === '404'}">
                Page not found ...
                <!-- TODO: design simple 404 page -->
              </div>
            </div>
          </main>

          <!-- float elemets -->
          <mwc-icon-button
            class="menu-button"
            @click="${() => chatRoom.setProperty('sideMenuOpened', true)}"
          >${menuIcon}</mwc-icon-button>

          <a href="/" class="salavat-small-icon"><mwc-icon-button @click="${() => chatRoom.postMessage('cheatClick')}">${salavatSmallIcon}</mwc-icon-button></a>

          <mwc-icon-button class="get-app-button" @click="${() => chatRoom.postMessage('request-install')}">${getAppIcon}</mwc-icon-button>

        </div>
      </mwc-drawer>

      <!-- Over screen elements -->
      <!-- <div class="guide">
        <img src="../image/menu-guide.png" id="menu">
        <img src="../image/submit-guide.png" id="submit">
        <img src="../image/install-app-guide.png" id="install">
      </div> -->
      <page-desktop></page-desktop>
      <snack-bar></snack-bar>
    `;
  }

  protected updated() {
    this._log('updated');
    const iconButtonList: NodeListOf<IconButton> = this.renderRoot.querySelectorAll('mwc-icon-button');
    for (let i = iconButtonList.length - 1; i >= 0; i--) {
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
