import {LitElement, property} from 'lit-element';
import {appConfig, logger} from '../config';


export abstract class BaseElement extends LitElement {
  @property({type: Boolean, reflect: true}) debug = appConfig.debug;

  protected override async performUpdate(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    super.performUpdate();
  }

  protected _fire(eventName: string, detail: unknown, bubbles = false):void {
    logger.logMethodArgs('event', {eventName, detail});
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles,
    }));
  }
}
