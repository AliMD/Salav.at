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
  maxWith: 540,
  iconSize: 28,
};

export const styleConfig = css`
  :host {
    --app-primary-color: #3277b9;
    --app-primary-text-color: #3277b9;
    --mdc-theme-primary: var(--app-primary-color);
    --mdc-theme-on-primary: var(--app-primary-text-color);
    --mdc-icon-size: ${appConfig.iconSize}px;
  }
`;
