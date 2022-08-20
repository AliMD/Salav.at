import {createLogger} from '@alwatr/logger';
import {LitElement, PropertyValues} from 'lit';

import {logger} from '../config';

export abstract class BaseElement extends LitElement {
  protected _logger = createLogger(`<${this.tagName}>`);

  constructor() {
    super();
    this._logger.logMethod('constructor');
  }

  override connectedCallback(): void {
    this._logger.logMethod('connectedCallback');
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this._logger.logMethod('disconnectedCallback');
    super.disconnectedCallback();
  }

  protected override update(_changedProperties: PropertyValues): void {
    this._logger.logMethod('update');
    super.update(_changedProperties);
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    this._logger.logMethod('firstUpdated');
    super.firstUpdated(_changedProperties);
  }

  override dispatchEvent(event: CustomEvent | Event): boolean {
    this._logger.logMethodArgs('dispatchEvent', {type: event.type});
    return super.dispatchEvent(event);
  }

  protected override async performUpdate(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    super.performUpdate();
  }

  protected _fire(eventName: string, detail: unknown, bubbles = false): void {
    logger.logMethodArgs('event', {eventName, detail});
    this.dispatchEvent(
        new CustomEvent(eventName, {
          detail,
          bubbles,
          composed: bubbles,
        }),
    );
  }
}
