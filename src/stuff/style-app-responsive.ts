import { css } from "lit-element";
import { appConfig } from '../config';

export const styleAppResponsive = css`

  /* Installed app */
  @media all and (display-mode: standalone) {
     .get-app-button {
       display: none;
     }
  }

@media screen and (min-width: ${appConfig.maxWith+1}px) {
    page-desktop {
      display: flex;
    }

    mwc-drawer {
      display: none;
    }
  }
`;
