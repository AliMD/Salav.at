import { css } from "lit-element";

export const styleAppResponsive = css`

  /* Installed app */
  @media all and (display-mode: standalone) {
     .get-app-button {
       display: none;
     }
  }

  @media screen and (min-width: 769px) {
    page-desktop {
      display: flex;
    }

    mwc-drawer {
      display: none;
    }
  }
`;
