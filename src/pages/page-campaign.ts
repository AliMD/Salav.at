import {TemplateResult, html, css} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';

import {AppElement} from '../app-debt/app-element';
import {downloadIconOutlined, salavatSmallIcon} from '../components/icon';

declare global {
  interface HTMLElementTagNameMap {
    'page-campaign': PageCampaign;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-campaign': PageCampaign;
  }
}

@customElement('page-campaign')
export class PageCampaign extends AppElement {
  static override styles = css``;

  override render(): TemplateResult {
    return html`
      <ion-content>
        <ion-header>page campaign</ion-header>
        <div>
          گاهی آنقدر تلخی زندگی‌مان زیاد می شود،که رنگِ خوشِ شادی روزهایمان، در قرنطینه تلخِ روزگار به خاکستری می زند.
          اما ما یاد گرفته ایم تا دهانمان را با سلام و صلوات بر محمد و آل او و درخواست فرج فرزندشان شیرین کنیم تا همه
          چیز با نشاط شود و غم، از زندگی‌مان رخت ببندد. سلامی به شیرینی با تو بودن... به مناسبت ایام پر برکت شعبان و
          رمضان، تصمیم گرفتیم کمپین نذر "یک میلیون" صلوات به نیت دعا برای سلامتی و ظهور امام زمان (عجل الله تعالی فرجه
          الشریف) را از میلاد حضرتش تا میلاد کریم اهل‌بیت، حضرت امام حسن مجتبی (علیه السلام) در نیمه رمضان آغاز کنیم.
          برای هماهنگی و رسیدن به عدد یک میلیون صلوات، خواهشمندیم تعداد صلوات‌های فرستاده شده را در شمارنده وارد کنید.
          برای حمایت از کمپین، با دانلود و اشتراک‌گذاری پوستر زیر، به همراه منشن کردن پیج اینستاگرامی صلوات
          <a href="https://instagram.com/salav_at_/" target="_blank">@Salav_at_</a>
          همراه این کمپین باشید...
        </div>
        <div class="btn-container">
          <a href="/">
            <mwc-button>
              <div class="button-content">${salavatSmallIcon} ثبت صلوات</div>
            </mwc-button>
          </a>
          <a href="image/salavat-story.jpg" target="_blank" download>
            <mwc-button>
              <div class="button-content">${downloadIconOutlined} دانلود استوری</div>
            </mwc-button>
          </a>
        </div>
      </ion-content>
    `;
  }
}
