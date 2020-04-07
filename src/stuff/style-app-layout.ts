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
    background-repeat: no-repeat;
    background-size: cover;
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
    display: flex; /* for gap and footer */
    flex-direction: column;
    box-sizing: border-box;
    padding-top: 4rem;
    height: 100%;
    color: var(--app-primary-text-color);
    background-color: var(--app-primary-color);
    background-image: url("image/background.jpg");
    background-position-x: left;
    background-position-y: bottom;
    background-repeat: no-repeat;
    background-size: cover;
    text-align: left;
    --mdc-theme-primary: var(--app-primary-text-color);
    --mdc-typography-font-family: "Iran Sans", "Roboto", "Tahoma", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    fill: var(--app-primary-text-color); /* svg icons */
  }

  .drawer-content .salavat-badge {
    border-radius: 0px 100px 100px 0px;
    margin-right: 1.8rem;
    padding: 1.8rem 3rem;
    background-color: var(--app-dark-background-color);
    box-shadow: 2px 2px 20px -6px rgba(0,0,0,0.75);
  }

  .drawer-content .salavat-badge .title {
    font-size: 1.2rem;
    word-spacing: -4px;
  }

  .drawer-content .salavat-badge .number {
    font-size: 2.5rem;
    font-weight: 500;
  }

  .drawer-content .menu {
    padding: 1rem;
    --mdc-typography-button-font-weight: 300;
    --mdc-typography-button-letter-spacing: normal;
    --mdc-typography-button-font-size: 1.2rem;
  }

  .drawer-content .menu mwc-button {
    margin-top: 1rem;
    /* --mdc-button-horizontal-padding: 3rem; */
  }

  .drawer-content .menu mwc-button .button-content {
    padding-left: 1.8rem;
    flex-grow: 1;
    word-wrap: nowrap;

    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
  }

  .drawer-content .menu svg {
    margin-right: 0.5rem;
    width: 24px;
    height: 24px;
  }

  .drawer-content .gap {
    flex-grow: 1;
  }

  .drawer-footer {
    display: block;
    color: inherit;
    text-decoration: none;
    margin-left: 3rem;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
    font-size: 14px;
    /* opacity: 0.9; */
  }

  main {
    /* Workaround for IE11 displaying <main> as inline */
    display: block;
    padding-top: 2em;
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
    transform: translate3d(0,0,0);
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

  display-count {
    margin: 2rem 1rem 0;
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
