import './stuff/director-assistant';
import { chatRoom } from './stuff/chat-room';
import { pageListArray, appConfig } from './config';
import { SnackbarOption } from './stuff/snack-bar';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';

/*
  routing ....
*/
chatRoom.onPropertyChanged('locationPath', async (locationPath: string | unknown) => {
  if (!(typeof locationPath === 'string')) return;
  const splitPath = locationPath.slice(1).split('/');
  const pageName: string = splitPath.shift() || 'home';
  chatRoom.setProperty('page', pageName);
  chatRoom.setProperty(`locationPath_${pageName}`, splitPath);
});

chatRoom.onPropertyChanged('page', async (pageName: string | unknown) => {
  if (!(typeof pageName === 'string')) return;

  const page = pageListArray.find(pageItem => pageItem.slug === pageName);

  if (!page) {
    chatRoom.postMessage('invalidUri');
    return;
  }

  // if (page.externalFilePath) {
  //   try {
  //     await import(page.externalFilePath);
  //   }
  //   catch (err) {
  //     chatRoom.postMessage('invalidUri');
  //     console.error('<director> Error in importing file %s for page %s: %o', page?.externalFilePath, pageName, err);
  //   }
  // }
});

chatRoom.onPropertyChanged('page', (pageName: string | unknown) => {
  // Close side menu on page changed
  chatRoom.setProperty('sideMenuOpened', false);
  // Scroll to top on page changed
  chatRoom.postMessage('scrollTop');

  chatRoom.setProperty('showSubmit', pageName === 'home' && chatRoom.getProperty('userSalavatCountIncrease'));
});

chatRoom.onMessage('invalidUri', () => {
  chatRoom.setProperty('page', '404');
});

/*
  app install ...
*/
chatRoom.onMessage('app-installed', () => {
  chatRoom.setProperty('snackbar', <SnackbarOption>{
    open: true,
    text: 'این برنامه با موفقیت نصب و به لیست برنامه های شما اضافه شد.',
  });
});

chatRoom.onMessage('request-install-manually', () => {
  chatRoom.setProperty('snackbar', <SnackbarOption>{
    open: true,
    text: 'به منظور نصب برنامه، از منوی تنظیمات، گزینه‌ی Add to Home screen را انتخاب کنید.',
    // @TODO: iOS
  });
});

chatRoom.onMessage('window-loaded-standalone', () => {
  if (window.innerWidth > appConfig.maxWith) {
    window.resizeTo(414, 736); // iPhone 8 plus
    idlePeriod.run(() => {
      window.resizeTo(414, 736); // iPhone 8 plus
    });
  }
});

/*
  user salavat count ....
*/
chatRoom.onPropertyChanged('userSalavatCountIncrease', (userSalavatCountIncrease: number | unknown) => {
  chatRoom.setProperty('showSubmit', !!userSalavatCountIncrease);
});

chatRoom.setProperty('userSalavatCount', 10);
chatRoom.setProperty('userSalavatCountIncrease', 0);
chatRoom.onMessage('submit-salavat', () => {
  const userSalavatCount: number = chatRoom.getProperty('userSalavatCount') as number || 0;
  const userSalavatCountIncrease: number = chatRoom.getProperty('userSalavatCountIncrease') as number || 0;
  chatRoom.setProperty('userSalavatCount', userSalavatCount + userSalavatCountIncrease);
  chatRoom.setProperty('userSalavatCountIncrease', 0);
});
