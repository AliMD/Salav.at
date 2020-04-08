import { chatRoom } from './chat-room';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
import { installRouter } from 'pwa-helpers/router';
import { installOfflineWatcher } from 'pwa-helpers/network';


const lockOrientation: (orientation: OrientationLockType) => Promise<void> = screen['lockOrientation'] || screen['mozLockOrientation'] || screen['msLockOrientation'] || screen.orientation?.lock;
if (lockOrientation) {
  lockOrientation('portrait');
}

window.addEventListener('resize', () => {
  chatRoom.postMessage('window-resized'); // _dispatch debounce with animationFrame automatically
});

window.addEventListener('load', () => {
  chatRoom.postMessage('window-loaded');

  if (navigator['standalone']) {
    chatRoom.postMessage('window-loaded-standalone', { ios: true }); // Launched: Installed (iOS)
  }
  else if (matchMedia('(display-mode: standalone)').matches) {
    chatRoom.postMessage('window-loaded-standalone', { ios: false }); // 'Launched: Installed'
  }
  else {
    chatRoom.postMessage('window-loaded-browser-tap', { ios: true }); // Launched: Browser Tab
  }
});

chatRoom.onMessage('scrollTop', () => {
  if (!(window.scrollTo && window.scrollY > 0)) return;
  idlePeriod.run(() => scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  }));
});

installOfflineWatcher((offline: boolean) => {
  chatRoom.setProperty('offline', offline);
});

installRouter(location => {
  const locationPath: string = window.decodeURIComponent(location.pathname);
  chatRoom.setProperty('locationPath', locationPath);
});

// Install PWA
let deferredPrompt;

window.addEventListener('appinstalled', () => {
  chatRoom.postMessage('app-installed');
});

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-info-bar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = event;
  // Update UI notify the user they can install the PWA
  // @TODO: install request
});

chatRoom.onMessage('request-install', async () => {
  if (deferredPrompt?.prompt) {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    chatRoom.postMessage(`request-install-${choiceResult.outcome === 'accepted' ? 'accepted' : 'dismissed'}`);
  }
  else {
    chatRoom.postMessage('request-install-manually');
  }
});

