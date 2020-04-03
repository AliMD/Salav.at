import { css } from "lit-element";

export const pageListObject: {
  [pageName: string]: {
    externalFilePath?: string;
  }
} = {
  'home': {},
  '404': {
    // externalFilePath: './page-404',
  },
};

export const appConfig = {
  // unit: px
  maxWith: 450,
  mainImageHeight: 500,
  iconSize: 28,
  iconButtonSize: 56,
};

export const styleConfig = css`
  :host {
    --app-primary-color: #3277b9;
    --app-accent-color: #cf7a59;
    /* --app-accent-color: #d84315; */
    --app-primary-text-color: #ffffff;
    --app-light-back-color: #eeeeee;

    --curve-line-back-color: var(--app-light-back-color);
    --curve-line-progress-color: var(--app-accent-color);
    --mdc-theme-primary: var(--app-primary-color);
    --mdc-theme-on-primary: var(--app-primary-text-color);
    --mdc-icon-size: ${appConfig.iconSize}px;
    --mdc-icon-button-size: ${appConfig.iconButtonSize}px;
  }
`;
