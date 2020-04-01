import { chatRoom } from './chat-room';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
import { installRouter } from 'pwa-helpers/router';
import { installOfflineWatcher } from 'pwa-helpers/network';

// window.addEventListener('resize', () => {
//   chatRoom.postMessage('window-resized'); // _dispatch debounce with animationFrame automatically
// });

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
