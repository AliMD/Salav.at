import {LitElement, property} from 'lit-element';
import {appConfig, Logger} from '../config';


export abstract class BaseElement extends LitElement {
  @property({type: Boolean, reflect: true}) debug = appConfig.debug;

  protected override async performUpdate(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    super.performUpdate();
  }

  protected _fire(eventName: string, detail: unknown, bubbles = false):void {
    Logger.incident('event', 'fire_event', 'fire %s {%o}', eventName, detail);
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: bubbles,
    }));
  }
}
