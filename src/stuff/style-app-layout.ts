import { css } from "lit-element";
import { appConfig } from '../config';

const mainImageMargin = 60;
const borderRadius = Math.round((appConfig.maxWith - (mainImageMargin * 2)) / 2);

export const styleAppLayout = css`
  /* salavat-pwa */
  :host {
    display: block;
    font-size: 1rem;
    font-weight: 300;
    box-sizing: border-box;
    height: 100vh;
    user-select: none;
    overflow: hidden;
    color: var(--app-primary-text-color);
    background-color: var(--app-primary-color);
    background-image: url("image/background.jpg");
    background-position-x: right;
    background-position-y: bottom;
    background-size: cover;
    background-repeat: no-repeat;
  }

  @media screen and (min-width: ${appConfig.maxWith + 1}px) {
    :host {
      /* position: relative; FIXME: more test */
      max-width: ${appConfig.maxWith}px;
      height: 850px;
      margin: 1em auto;
      border-radius: 15px;
      /* box-shadow: 1px 2px 4px 0px black; */
    }
  }

  .drawer-content {
    color: var(--app-primary-color);
  }

  main {
    /* Workaround for IE11 displaying <main> as inline */
    display: block;
  }

  .main-image {
    width: auto;
    margin: 0 ${mainImageMargin}px;
    height: ${appConfig.mainImageHeight}px;
    border-radius: 0 0 ${borderRadius}px ${borderRadius}px;
    background-image: url("image/main-image.jpg");
    background-position-x: center;
    background-position-y: top;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 2px 4px 50px #37474F;
    transform: translate3d(0, 0, 0);
    will-change: transform;
    transition-property: transform;
    transition-duration: 200ms;
    transition-timing-function: ease-out;

    /* style submit-button */
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  .submit-button {
    background-color: var(--app-primary-color);
    border-radius: 100px 100px 0 0;
    padding: 0 45px 20px;
    opacity: 0.9;
    transform: translate3d(0px, 85px, 0px);
    will-change: transform;
    transition: 1s transform ease-out;
    --mdc-icon-size: ${appConfig.iconSize * 1.6}px;
  }

  .submit-button[show] {
    transform: translate3d(0, 25px, 0);
  }

  mwc-slider {
    display: block;
    margin: 1rem ${mainImageMargin}px;
  }

  display-count {
    margin: 0 1rem;
  }

  .menu-button {
    position: absolute;
    left: ${(mainImageMargin - appConfig.iconButtonSize) / 2}px;
    top: 0;
  }

  .get-app-button {
    position: absolute;
    right: 1px;
    bottom: 1px;
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
    fill: white;
  }
`;
