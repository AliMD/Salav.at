import {createLogger} from '@alwatr/logger';
import {LocalizeController} from '@shoelace-style/localize/dist/index.js';
import {css, LitElement} from 'lit';

import ionicReset from '../stylesheets/ionic.reset';
import ionicTheming from '../stylesheets/ionic.theming';
import ionicUtilities from '../stylesheets/ionic.utilities';
import reset from '../stylesheets/reset';

import type {Logger} from '@alwatr/logger/type';
import type {PropertyValues, CSSResult} from 'lit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
type Constructor<ClassType = {}> = new (...args: any[]) => ClassType;

export declare class LoggableMixinInterface extends LitElement {
  protected _logger: Logger;
  protected _localize: LocalizeController;
}

export function LoggableMixin<ClassType extends Constructor<LitElement>>(
    superClass: ClassType,
): Constructor<LoggableMixinInterface> & ClassType {
  class LoggableMixinClass extends superClass {
    protected _logger = createLogger(`<${this.tagName.toLowerCase()}>`);
    protected _localize = new LocalizeController(this);

    static styles: CSSResult[] = [
      ionicReset,
      reset,
      ionicTheming,
      ionicUtilities,
      css`
        section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 1rem;
        }
        section .box {
          display: flex;
          flex-direction: column;
          background-color: var(--ion-color-step-50, #fff);
          border-radius: 12px;
          box-shadow: 0 12px 32px -24px var(--ion-color-step-500);
          padding: 1rem;
        }
        section .box ion-col {
          display: flex;
          align-items: center;
        }
        section .box ion-col.start,
        section .box ion-col.start ion-text {
          align-items: center;
          justify-content: flex-start;
        }
        section .box ion-col.start ion-text {
          display: flex;
        }
        section .box ion-col.bordered {
          border: 2px solid var(--ion-color-base);
          border-radius: 4px;

          --ion-grid-column-padding: 0;
          --padding-top: 10px;
          --padding-end: 0;
          --padding-bottom: 10px;
          --padding-start: 16px;
        }
        section .box ion-col.bordered ion-select {
          --padding-top: 6px;
          --padding-end: 6px;
          --padding-bottom: 6px;
          --padding-start: 6px;
        }
        section .box ion-col.bordered ion-select::part(text) {
          display: flex;
          justify-content: center;
          font-size: 14px;
          text-transform: uppercase;
          color: var(--ion-color-base);
        }
        section .box ion-col.bordered ion-select::part(icon) {
          color: var(--ion-color-base);
        }
        section .box ion-col ion-select {
          width: 100%;
        }
        section .box ion-button {
          width: 100%;
        }
        .select__opt-icon {
          font-size: 18px;
        }
        ion-button ion-label {
          margin: auto;
        }
        ion-button er-iconsax {
          margin-inline-start: auto;
        }

        @media screen and (max-width: 768px) {
          section .box {
            width: 95%;
          }
        }
      `,
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
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

    // protected override createRenderRoot(): Element | ShadowRoot {
    //   return this;
    // }

    protected override update(_changedProperties: PropertyValues): void {
      this._logger.logMethod('update');
      super.update(_changedProperties);
    }

    protected override firstUpdated(_changedProperties: PropertyValues): void {
      this._logger.logMethod('firstUpdated');
      super.firstUpdated(_changedProperties);
      this.removeAttribute('unresolved');
    }

    override dispatchEvent(event: CustomEvent | Event): boolean {
      this._logger.logMethodArgs('dispatchEvent', {type: event.type});
      return super.dispatchEvent(event);
    }
  }
  return LoggableMixinClass as unknown as Constructor<LoggableMixinInterface> & ClassType;
}

export const AppElement = LoggableMixin(LitElement);
