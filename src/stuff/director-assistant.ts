import {chatRoom} from './chat-room';
import {installRouter} from 'pwa-helpers/router';
import {installOfflineWatcher} from 'pwa-helpers/network';

requestAnimationFrame(async () => {
  try {
    const orientation: OrientationLockType = 'portrait';
    'lockOrientation' in screen && await screen['lockOrientation'](orientation);
    'mozLockOrientation' in screen && await screen['mozLockOrientation'](orientation);
    'msLockOrientation' in screen && await screen['msLockOrientation'](orientation);
    screen.orientation?.lock && await screen.orientation.lock(orientation);
  } catch (err) {
    console.log('lockOrientation failed: %s', err);
  }
});

window.addEventListener('resize', () => {
  chatRoom.postMessage('window-resized'); // _dispatch debounce with animationFrame automatically
});

window.addEventListener('load', () => {
  chatRoom.postMessage('window-loaded');

  if (navigator['standalone']) {
    chatRoom.postMessage('window-loaded-standalone', {ios: true}); // Launched: Installed (iOS)
  } else if (matchMedia('(display-mode: standalone)').matches) {
    chatRoom.postMessage('window-loaded-standalone', {ios: false}); // 'Launched: Installed'
  } else {
    chatRoom.postMessage('window-loaded-browser-tap', {ios: true}); // Launched: Browser Tab
  }
});

chatRoom.onMessage('window-loaded', async () => {
  if (! ('serviceWorker' in navigator)) return;
  console.log('SW registered');

  const registration = await navigator.serviceWorker.register('service-worker.js', {scope: '/'});

  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    if (newWorker == null) return;
    console.log('SW update found, status: %s', newWorker.state);
    newWorker.addEventListener('statechange', () => {
      console.log('SW state changed: %s', newWorker.state);
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) { // if old controller available then its update else its new install
          chatRoom.postMessage('service-worker-updated');
        }
      } else if (newWorker.state === 'redundant') {
        console.warn('SW redundant!');
      }
    });
  });
});

chatRoom.onMessage('scrollTop', () => {
  if (!('scrollTo' in window && window.scrollY > 0)) return;
  requestAnimationFrame(() => scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  }));
});

installOfflineWatcher((offline: boolean) => {
  chatRoom.setProperty('offline', offline);
});

installRouter((location) => {
  const locationPath: string = window.decodeURIComponent(location.pathname);
  chatRoom.setProperty('locationPath', locationPath);
});

// Install PWA
let deferredPrompt;

window.addEventListener('appinstalled', () => {
  chatRoom.postMessage('app-installed');
});

window.addEventListener('beforeinstallprompt', (event: Event) => {
  event.preventDefault(); // Prevent the mini-info-bar from appearing on mobile
  deferredPrompt = event; // Stash the event so it can be triggered later.
  chatRoom.postMessage('app-installable');
});

chatRoom.onMessage('request-install', async () => {
  if (deferredPrompt?.prompt) {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    chatRoom.postMessage(`request-install-${choiceResult.outcome === 'accepted' ? 'accepted' : 'dismissed'}`);
  } else {
    chatRoom.postMessage('request-install-manually');
  }
});

/*
  Local Storage
*/

const parseJSON = <T>(str: string): T | null => {
  let parsed: T | null = null;
  try {
    parsed = JSON.parse(str) as T;
  } catch (err) {
    console.error('parseJSON: %s', str);
  }
  return parsed;
};

export const localStorageGetItem = <T>(str: string, defaultValue: T): T => {
  const item: string | null = localStorage.getItem(str);
  if (item == null) return defaultValue;
  const parsed: T | null = parseJSON<T>(item);
  if (parsed == null) return defaultValue;
  else return parsed;
};
