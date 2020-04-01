import { css } from "lit-element";
import { appConfig } from './config';

const margin = 100;
const borderRadius = Math.round((appConfig.maxWith - (margin * 2)) / 2);

export const styleAppLayout = css`
  main {
    /* Workaround for IE11 displaying <main> as inline */
    display: block;
  }

  .main-image {
    width: auto;
    margin: 0 ${margin}px;
    height: 500px;
    border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
    background-image: url('/design/splash.png');
    background-position-x: center;
    background-position-y: bottom;
    box-shadow: 2px 4px 50px #37474F;
    background-size: cover;
    transform: translate3d(0,0,0);
    will-change: transform;
    transition-property: transform;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  .submit-button {

  }

  .menu-button {
    position: absolute;
    left: 0;
    top: 0;
  }

  .get-app-button {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .footer-text {
    position: absolute;
    left: 1em;
    bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    direction: ltr;
  }

  .footer-text svg {
    display: block;
    margin-left: 0.375rem;
    width: 1rem;
    height: 1rem;
  }
`;
