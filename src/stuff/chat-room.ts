import {logger} from '../config';
import {isRepeated} from './debounce';

const dispatchEventHistory: Record<string, unknown> = {};
export const eventTarget: EventTarget = document.createElement('span');
// export const eventTarget: EventTarget = 'EventTarget' in window ? new EventTarget() : document.createElement('span');

const onMessage = (
    eventName: string, callback: (detail?: unknown) => void, option: { preserve: boolean } = {preserve: true},
):void => {
  logger.logMethodArgs('onMessage', {eventName, preserve: option.preserve ?? false});
  eventTarget.addEventListener(eventName, (event: Event) => callback(event['detail']));
  if (option.preserve && eventName in dispatchEventHistory) {
    setTimeout(callback, 0, dispatchEventHistory[eventName]); // callback in next micro task
  }
};

const postMessage = async (
    eventName: string, detail?: string | boolean | unknown, option: { preserve: boolean } = {preserve: true},
):Promise<void> => {
  if (option.preserve) {
    dispatchEventHistory[eventName] = detail;
  }

  if (await isRepeated(eventName)) {
    return;
  }
  // else if first one in animation frame duration
  logger.logMethodArgs('postMessage', {eventName, detail, preserve: option.preserve ?? false});
  eventTarget.dispatchEvent(new CustomEvent(eventName, {detail}));
};

const setProperty = (propertyName: string, newValue: unknown):void => {
  postMessage(`appProperty_${propertyName}_changed`, newValue, {preserve: true});
};

const getProperty = (propertyName: string): unknown => {
  const eventName = `appProperty_${propertyName}_changed`;
  return dispatchEventHistory[eventName];
};

const onPropertyChanged = (propertyName: string, callback: (newVal?: unknown) => void):void => {
  onMessage(`appProperty_${propertyName}_changed`, callback, {preserve: true});
};

export const chatRoom = {onMessage, postMessage, setProperty, getProperty, onPropertyChanged};
