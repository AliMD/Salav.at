import { AsyncInterface } from '@polymer/polymer/interfaces';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce';
import { animationFrame } from '@polymer/polymer/lib/utils/async';
import 'request-animation-frame-polyfill-es6';

export const eventTarget: EventTarget = 'EventTarget' in window ? new EventTarget() : document.createElement('span');
const dispatchEventHistory: Record<string, unknown> = {};
const dispatchJobList: Record<string, Debouncer> = {};
const debug = true;

const _log = (message: unknown, ...restParam: unknown[]) => {
  if (debug) {
    console.log(`%cChatRoom%c ${message}`, "color: #4CAF50; font-size: 1.2em;", "color: inherit;font-size: 1em", ...restParam);
  }
};

const onMessage = (eventName: string, callback: (detail?: unknown) => void, option: { preserve: boolean } = { preserve: false }) => {
  _log('onMessage on %s %s', eventName, option.preserve ? '(preserve)' : '');
  eventTarget.addEventListener(eventName, (event: Event) => callback(event['detail']));
  if (option.preserve && dispatchEventHistory[eventName] !== undefined) {
    callback(dispatchEventHistory[eventName]);
  }
};

const postMessage = (eventName: string, detail?: string | boolean | unknown, option: { preserve: boolean } = { preserve: false }) => {
  dispatchJobList[eventName] = Debouncer.debounce(dispatchJobList[eventName], animationFrame as AsyncInterface, () => {
    _log('postMessage %s with %o %s', eventName, detail, option.preserve ? '(preserve)' : '');
    eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
    if (option.preserve) {
      dispatchEventHistory[eventName] = detail;
    }
  });
};

const setProperty = (propertyName: string, newValue: unknown) => {
  postMessage(`appProperty_${propertyName}_changed`, newValue, { preserve: true });
}

const getProperty = (propertyName: string): unknown => {
  const eventName = `appProperty_${propertyName}_changed`;
  return dispatchEventHistory[eventName];
};

const onPropertyChanged = (propertyName: string, callback: (newVal?: unknown) => void) => {
  onMessage(`appProperty_${propertyName}_changed`, callback, { preserve: true });
};

export const chatRoom = {onMessage, postMessage, setProperty, getProperty, onPropertyChanged};
