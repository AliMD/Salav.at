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
  snackbarTimeout: 5000, //ms
  // UI
  maxWith: 450, //px
  mainImageHeight: 500, //px
  iconSize: 28, //px
  iconButtonSize: 56, //px
};

export const styleConfig = css`
  :host {
    --app-primary-color: #3277b9;
    --app-primary-text-color: #ffffff;
    --mdc-theme-primary: var(--app-primary-color);
    --mdc-theme-on-primary: var(--app-primary-text-color);
    --mdc-icon-size: ${appConfig.iconSize}px;
    --mdc-icon-button-size: ${appConfig.iconButtonSize}px;
  }
`;
