import { css, SVGTemplateResult } from "lit-element";
import { campaignIcon, aboutUsIcon, supportIcon, imageIcon, getAppIcon, helpIcon } from './stuff/icon';

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
  {
    slug: 'support',
    sideMenu: true,
    title: 'حمایت',
    icon: supportIcon,
  },
  {
    slug: 'download-wallpaper',
    sideMenu: true,
    title: 'دانلود والپیپر',
    icon: imageIcon,
  },
  {
    slug: 'install',
    sideMenu: true,
    title: 'نصب برنامه',
    icon: getAppIcon,
  },
  {
    slug: 'help',
    sideMenu: true,
    title: 'راهنما',
    icon: helpIcon,
  },
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
  snackbarTimeout: 5000, //ms
  // UI
  maxWith: 450, //px
  mainImageHeight: 430, //px
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
    --mdc-theme-on-primary: var(--app-primary-text-color);
    --mdc-icon-size: ${appConfig.iconSize}px;
    --mdc-icon-button-size: ${appConfig.iconButtonSize}px;
  }
`;
