import {createLogger} from '@alwatr/logger';
import {SignalInterface} from '@alwatr/signal';

export default async function registerSW(): Promise<void> {
  const logger = createLogger('register-sw');
  const signal = new SignalInterface('sw-update');

  if ('serviceWorker' in navigator) {
    return await navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          logger.logMethodArgs('then', {registration: registration});

          registration.addEventListener('updatefound', () => {
            logger.logMethod('updatefound');
          });
          signal.addListener(() => registration.update());
        })
        .catch((error) => logger.error('error', '500', error));
  }
}
