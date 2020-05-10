import { isRepeated } from './debounce';

export const eventTarget: EventTarget = 'EventTarget' in window ? new EventTarget() : document.createElement('span');
const dispatchEventHistory: Record<string, unknown> = {};

const _log = (message: unknown, ...restParam: unknown[]) => {
  if (window['pazhDebug7112']) {
    console.log(`%cAppRoom%c ${message}`, "color: #4CAF50; font-size: 1.2em;", "color: inherit;font-size: 1em", ...restParam);
  }
};

const onMessage = (eventName: string, callback: (detail?: unknown) => void, option: { preserve: boolean } = { preserve: true }) => {
  _log('onMessage on %s %s', eventName, option.preserve ? '(preserve)' : '');
  eventTarget.addEventListener(eventName, (event: Event) => callback(event['detail']));
  if (option.preserve && dispatchEventHistory[eventName] !== undefined) {
    setTimeout(callback, 0, dispatchEventHistory[eventName]); // callback in next micro task
  }
};

const postMessage = async (eventName: string, detail?: string | boolean | unknown, option: { preserve: boolean } = { preserve: true }) => {
  if (option.preserve) {
    dispatchEventHistory[eventName] = detail;
  }

  if (await isRepeated(eventName)) return;

  detail = dispatchEventHistory[eventName]; // get last changed detail value
  _log('postMessage %s with %o %s', eventName, detail, option.preserve ? '(preserve)' : '');
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

export const appRoom = {onMessage, postMessage, setProperty, getProperty, onPropertyChanged};
