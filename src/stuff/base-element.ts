import { LitElement, property } from 'lit-element';
import { appConfig } from '../config';

type consoleLogLevel = 'log' | 'info' | 'clear' | 'debug' | 'error' | 'warn' | 'trace'

export abstract class BaseElement extends LitElement {
  @property({ type: Boolean, reflect: true }) debug = appConfig.debug;

  protected override async performUpdate(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    super.performUpdate();
  }

  private __logger (logLevel: consoleLogLevel, message: unknown, ...restParam: unknown[]) {
    // first args must be separated as keyPattern for fix issue of `this._log('a=%s', a)`
    const tagName = (this.tagName + '').toLowerCase();
    console[logLevel](`%c<%s>%c ${message}`, "color: #4CAF50; font-size: 1.2em;", tagName, "color: inherit;font-size: 1em", ...restParam);
  }

  protected log (message: unknown, ...restParam: unknown[]) {
    this.__logger("log", message, ...restParam);
  }

  protected _log (message: unknown, ...restParam: unknown[]) {
    if (this.debug) {
      this.log(message, ...restParam);
    }
  }

  protected _warn (message: unknown, ...restParam: unknown[]) {
    this.__logger("warn", message, ...restParam);
  }

  protected _error (message: unknown, ...restParam: unknown[]) {
    this.__logger("error", message, ...restParam);
  }

  protected _fire (eventName: string, detail: unknown, bubbles: boolean = false) {
    this._log('fire %s {%o}', eventName, detail);
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles
    }));
  }
}
