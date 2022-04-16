import {css} from 'lit-element';

import {appConfig, safeAreaInsetTop} from '../config';

export const styleAppLayout = css`
  /* salavat-pwa */
  :host {
    display: block;
    font-size: 1rem;
    font-weight: 300;
    box-sizing: border-box;
    height: 100%;
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

  a {
    color: inherit;
    text-decoration: none;
  }

  svg {
    fill: var(--app-primary-text-color); /* svg icons */
  }

  mwc-button {
    --mdc-theme-primary: var(--app-primary-text-color);
    --mdc-typography-font-family: "Iran Sans", "Roboto", "Tahoma",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji","Segoe UI Symbol";
    --mdc-typography-button-text-transform: none;
    --mdc-typography-button-font-weight: 300;
    --mdc-typography-button-letter-spacing: normal;
    --mdc-typography-button-font-size: 1em;
  }

  mwc-button .button-content {
    display: inline-flex;
    align-items: center;
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
  }

  .drawer-content a.salavat-badge {
    display: block;
    border-radius: 0px 100px 100px 0px;
    margin-right: 1.8rem;
    padding: 1.8rem 3rem;
    background-color: var(--app-dark-background-color);
    box-shadow: 2px 2px 20px -6px rgba(0,0,0,0.75);
  }

  .drawer-content a.salavat-badge .title {
    font-size: 1.2rem;
    word-spacing: -4px;
  }

  .drawer-content a.salavat-badge .number {
    font-size: 2.5rem;
    font-weight: 500;
  }

  .drawer-content .menu {
    padding: 1rem;
    --mdc-typography-button-font-weight: 300;
    --mdc-typography-button-letter-spacing: normal;
    --mdc-typography-button-font-size: 1.2rem;
  }

  .drawer-content svg {
    width: 28px;
    height: 28px;
  }

  .drawer-content .menu mwc-button {
    margin-top: 1rem;
    --mdc-typography-button-font-size: 1.2rem;
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
  }

  .drawer-content .gap {
    flex-grow: 1;
  }

  .drawer-content .social-media {
    margin-left: 3rem;
    margin-bottom: 0.5rem;
    text-align: left;
    --mdc-icon-button-size: 30px;
  }

  .drawer-footer {
    display: block;
    margin-left: 3rem;
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
    font-size: 14px;
    /* opacity: 0.9; */
  }

  .app-content {
    height: 100%;
  }

  main {
    display: flex;
    height: inherit;
    flex-direction: column;
    align-content: stretch;
  }

  .page:not([active]) {
    display: none;
  }

  .main-image {
    width: auto;
    flex-grow: 4;
    flex-shrink: 0;
    margin: 0 ${appConfig.mainImageMargin}px;
    border-radius: 0 0 200px 200px;
    background-image: url("image/main-image.jpg");
    background-position-x: center;
    background-position-y: top;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 2px 4px 50px #37474F;

    /* transform: translate3d(0, 0, 0);
    will-change: transform;
    transition-property: transform; */
    /* TODO: refactor to translate3d for animation performance */
    will-change: height;
    transition-property: height;

    transition-duration: 250ms;
    transition-timing-function: ease-out;

    /* style submit-button */
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  :host([has-notch]) .main-image {
    margin-top: ${safeAreaInsetTop > 8 ? safeAreaInsetTop - 8 : safeAreaInsetTop}px;;
    border-radius: 10px 10px 200px 200px;
  }

  .page-container {
    flex-grow: 1;
    flex-shrink: 0;
  }

    /* All text mode pages */
  .page.text-mode {
    padding: 20px ${appConfig.mainImageMargin}px;
    font-size: 0.75rem;
    text-align: justify;
    text-justify: inter-word;
    z-index: 100;
  }

  .page.campaign .btn-container {
    text-align: center;
  }

  .page.campaign .btn-container a {
    margin: 1rem 0.5rem;
    display: inline-block;
  }

  .page.campaign a svg {
    margin-left: 0.5em;
    width: 1.5em;
    height: 1.5em;
    width: 28px;
    height: 28px;
  }

  /* .guide {
    position: absolute;
    height:100vh;
    width: 100vw;
    background-color:black;
    opacity: 0.6;
  }

  .guide #menu {
    position:absolute;
    width:15rem;
    height:15rem;
    left: 2.2rem;
    top: 0.1rem;
  }

  .guide #submit {
    position:absolute;
    width:15rem;
    height:15rem;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }

  .guide #install {
    position: absolute;
    width: 12rem;
    height:12rem;
    right: 2.2rem;
    bottom: 0.1rem;
  } */

  .submit-button {
    background-color: var(--app-primary-color);
    border-radius: 100px 100px 0 0;
    padding: 0 45px 20px;
    opacity: 0.9;
    /* transform: translate3d(0px, 85px, 0px); */
    /* will-change: transform; */
    transition: 500ms top ease-out;
    --mdc-icon-size: ${appConfig.iconSize * 1.6}px;
    position: relative;
    top: 85px;
  }

  .submit-button[show] {
    top: 25px;
    /* transform: translate3d(0, 25px, 0); */
  }

  .menu-button {
    position: fixed;
    top: var(--safe-area-inset-top, 0);
    left: ${(appConfig.mainImageMargin - appConfig.iconButtonSize) / 2}px;
  }

  a.salavat-small-icon {
    display: block;
    position: fixed;
    top: var(--safe-area-inset-top, 0);
    right: ${(appConfig.mainImageMargin - appConfig.iconButtonSize) / 2}px;
    --mdc-icon-size: 30px;
  }

  .get-app-button {
    position: fixed;
    right: 1px;
    bottom: 1px;
  }

  .footer-text {
    position: fixed;
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
