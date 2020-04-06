import { css } from "lit-element";
import { appConfig } from '../config';

const mainImageMargin = 60;
const borderRadius = Math.round((appConfig.maxWith - (mainImageMargin * 2)) / 2);

export const styleAppLayout = css`
  /* salavat-pwa */
  :host {
    position: relative; /* TODO: more test */
    display: block;
    font-size: 1rem;
    box-sizing: border-box;
    height: 100vh;
    user-select: none;
    overflow: hidden;
    color: var(--app-primary-text-color);
    background-color: var(--app-primary-color);
    background-image: url('image/background.jpg');
    background-position-x: right;
    background-position-y: bottom;
    background-size: cover;
  }

  @media screen and (min-width: ${appConfig.maxWith + 1}px) {
    :host {
      max-width: ${appConfig.maxWith}px;
      height: 850px;
      margin: 1em auto;
      border-radius: 15px;
      /* box-shadow: 1px 2px 4px 0px black; */
    }
  }
  .counter {
    height: 10rem;
    border-radius: 0px 90px 90px 0px;
    width: 14rem;
    float: left;
    padding-top: 1rem;
    background-color: #102f4b;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: white;
    -webkit-box-shadow: 2px 2px 20px -6px rgba(0,0,0,0.75);
    -moz-box-shadow: 2px 2px 20px -6px rgba(0,0,0,0.75);
    box-shadow: 2px 2px 20px -6px rgba(0,0,0,0.75);
  }
  .drawer-items-div {
    padding-top: 5rem;
    width: 100%;
    color: white;
    font-size: 15pt;
    display: flex;
    flex-direction: column;
  }
  .drawer-content {
    padding-top: 4rem;
    box-sizing: border-box;
    height: 100vh;
    background-image: url('image/background.jpg');
    background-position: center;
    background-position: left;
    background-size: cover;
  }
  .my-salavat-title {
    margin:0;
  }
  .my-salavat-number {
    margin: 1rem 0rem 0rem 0rem;
    font-size: 35pt;
  }
  mwc-button {
    padding-left: 3.5rem;
    margin-top: 0.75rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  mwc-button svg {
    fill: white;
    margin-right: 0.5rem;
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
    background-image: url('image/main-image.jpg');
    background-position-x: center;
    background-position-y: top;
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

  curve-slider {
    position: absolute;
    top: ${appConfig.mainImageHeight-105}px;;
    left: 0;
    right: 0;
    margin: 0 auto;
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
  }
`;
