import { css } from "lit-element";
import { appConfig } from '../config';

export const styleAppResponsive = css`

  /* Installed app */
  @media all and (display-mode: standalone) {
     .get-app-button {
       display: none;
     }
  }
  /* mobile */
  @media screen and (max-width: 426px){
    .page.text-mode {
      padding: 1rem 2rem;
      font-size: 0.74rem;
    }
  }
  /* tablet */
  @media screen and (min-width: 427px){
    .page.text-mode {
      font-size: 1.1rem;
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
