import { appConfig } from '../config';
import { isRepeated } from './debounce';

const debug = appConfig.debug;
const dispatchEventHistory: Record<string, unknown> = {};
export const eventTarget: EventTarget = document.createElement('span');
// export const eventTarget: EventTarget = 'EventTarget' in window ? new EventTarget() : document.createElement('span');

const _log = (message: unknown, ...restParam: unknown[]) => {
  if (debug) {
    console.log(`%cChatRoom%c ${message}`, "color: #4CAF50; font-size: 1.2em;", "color: inherit;font-size: 1em", ...restParam);
  }
};

const onMessage = (eventName: string, callback: (detail?: unknown) => void, option: { preserve: boolean } = { preserve: true }) => {
  _log('onMessage: %s %s', eventName, option.preserve ? '(preserve)' : '');
  eventTarget.addEventListener(eventName, (event: Event) => callback(event['detail']));
  if (option.preserve && eventName in dispatchEventHistory) {
    setTimeout(callback, 0, dispatchEventHistory[eventName]); // callback in next micro task
  }
};

const postMessage = async (eventName: string, detail?: string | boolean | unknown, option: { preserve: boolean } = { preserve: true }) => {
  if (option.preserve) {
    dispatchEventHistory[eventName] = detail;
  }

  if(await isRepeated(eventName)) {
    return;
  }
  // else if first one in animation frame duration
  _log('postMessage: %s with %o %s', eventName, detail, option.preserve ? ' (preserve)' : '');
  eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
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
