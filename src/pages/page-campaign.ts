import {TemplateResult, html, css} from 'lit';
import {customElement} from 'lit/decorators/custom-element.js';

import {AppElement} from '../app-debt/app-element';

declare global {
  interface HTMLElementTagNameMap {
    'page-about': PageAbout;
  }
}

@customElement('page-about')
export class PageAbout extends AppElement {
  static override styles = css``;

  override render(): TemplateResult {
    return html`
      <ion-content>
        به نظر ما یه سری اتفاقات تو تاریخ موندگار میشه، به این جهت که می تونه کل دنیا رو درگیر خودش کنه. مثل بیماری
        کرونا که مدتیه درگیرش هستیم. هر سال به نیمه شعبان که می‌رسیدیم دور هم جمع می‌شدیم تا بتونیم با گرفتن یه جشن
        کوچیک، شاد باشیم از بودنش، شادی کنیم برای داشتنش و یادمون بمونه که وظیفه داریم تلاش کنیم برای اومدنش. اما کرونا
        امسال رو برامون متفاوت کرد. واسه همین تصمیم گرفتیم نیمه شعبان ۹۹ در بستر فضای مجازی فعالیت کنیم و نتیجش شد همین
        صلوات‌شماری که می بینید. خط به خط کدهای برنامه نویسی "صلوات"، پیکسل به پیکسل طراحی های گرافیکی "صلوات"، و ثانیه
        به ثانیه زمان هایی که برای ایجاد این بستر گذاشته شده، با عشق و به یاد کسی بوده که منتظریم با اومدنش تمام روزهای
        بعد از بودنش رو برامون، "با خاطره خوش"، به یادموندنی کنه... تقدیم به حجة بن الحسن (عجل الله تعالی فرجه الشریف)
      </ion-content>
    `;
  }
}
