import { css, SVGTemplateResult } from "lit-element";
import { campaignIcon, aboutUsIcon, salavatIcon } from './stuff/icon';

export const safeAreaInsetTop = ((): number => {
  const safeAreaInsetTop = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top'), 10);
  return !isNaN(safeAreaInsetTop) && safeAreaInsetTop > 0 ? safeAreaInsetTop : 0;
})();

export interface MenuItem {
  slug: string;
  sideMenu: true;
  title: string;
  icon: SVGTemplateResult;
}

export interface MenuItemHidden {
  slug: string;
  sideMenu: false;
}

export const pageListArray: Array<MenuItem | MenuItemHidden> = [
  {
    slug: 'home', // display in url
    sideMenu: true, // display in side menu
    title: 'Salav.at', // menu label
    icon: salavatIcon, // svg icon object from icon.ts
  },
  {
    slug: 'campaign', // display in url
    sideMenu: true, // display in side menu
    title: 'کمپین', // menu label
    icon: campaignIcon, // svg icon object from icon.ts
  },
  {
    slug: 'about',
    sideMenu: true,
    title: 'داستان ما',
    icon: aboutUsIcon,
  },
  // {
  //   slug: 'support',
  //   sideMenu: true,
  //   title: 'حمایت',
  //   icon: supportIcon,
  // },
  // {
  //   slug: 'download-wallpaper',
  //   sideMenu: true,
  //   title: 'دانلود والپیپر',
  //   icon: imageIcon,
  // },
  // {
  //   slug: 'install',
  //   sideMenu: true,
  //   title: 'نصب برنامه',
  //   icon: getAppIcon,
  // },
  // {
  //   slug: 'help',
  //   sideMenu: true,
  //   title: 'راهنما',
  //   icon: helpIcon,
  // },
  {
    slug: 'home',
    sideMenu: false,
  },
  {
    slug: '404',
    sideMenu: false,
  },
]

export const appConfig = {
  appVersion: '1.2.0',
  apiUri: 'https://api.salav.at',
  apiToken: 'pazh-vxah4f79o2ir97evva9ts7p5ya94zyx2-fjt',
  apiSalavatCountDocId: 'salavat/count',
  apiSalavatTestDocId: 'salavat/test',
  loadSalavatInterval: 1_000, //ms
  snackbarTimeout: 4_000, //ms
  sliderMaxRangeList: [200, 500, 1_000, 2_000, 5_000, 10_000, 15_000, 20_000, 50_000, 100_000],
  // UI
  maxWith: 768, //px
  mainImageHeight: 430, //px
  mainImageMargin: 60, //px
  iconSize: 28, //px
  iconButtonSize: 56, //px
};

export const styleConfig = css`
  :host {
    --app-primary-color: #3277b9;
    /* --app-accent-color: #cf7a59; */
    --app-accent-color: #f57c00;
    --app-primary-text-color: #ffffff;
    --app-light-back-color: #eeeeee;
    --app-dark-background-color: #102f4b;

    --mdc-typography-font-family: "Iran Sans", "Roboto", "Tahoma", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

    --mdc-theme-primary: var(--app-primary-color);
    --mdc-theme-secondary: var(--app-accent-color);
    --mdc-theme-on-primary: var(--app-primary-text-color);
    --mdc-theme-text-primary-on-dark: var(--app-primary-text-color);
    --mdc-icon-size: ${appConfig.iconSize}px;
    --mdc-icon-button-size: ${appConfig.iconButtonSize}px;
  }
`;

export interface SalavatCountInterface {
  _id: string;
  _owner: string;
  _createdTime: number;
  _lastEditedTime: number;
  _lastEditedBy: string;
  count: number;
}

export interface SalavatCountDataApiInterface {
  salavatCount: SalavatCountInterface;
}
