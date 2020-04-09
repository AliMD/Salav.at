import './stuff/director-assistant';
import { chatRoom } from './stuff/chat-room';
import { pageListArray, appConfig, SalavatCountInterface, SalavatCountDataApiInterface } from './config';
import { SnackbarOption } from './stuff/snack-bar';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
import { loadData, updateData } from './stuff/data-api';

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
  if (window.innerWidth >= appConfig.maxWith) {
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

chatRoom.onMessage('submit-salavat', async () => {
  if (chatRoom.getProperty('offline')) {
    chatRoom.setProperty('snackbar', <SnackbarOption>{
      open: true,
      text: 'لطفا وضعیت اتصال به اینترنت را بررسی کنید.',
    });
    return;
  }

  let userSalavatCount: number = chatRoom.getProperty('userSalavatCount') as number || 0;
  const userSalavatCountIncrease: number = chatRoom.getProperty('userSalavatCountIncrease') as number || 0;

  if (userSalavatCountIncrease > 0) {
    const result = await updateData<SalavatCountInterface>(appConfig.apiSalavatCountDocId, { _id: 'salavatCount', count: userSalavatCountIncrease })
    if (result.ok) {
      userSalavatCount += userSalavatCountIncrease;
      chatRoom.setProperty('salavatCount', result.data);
      chatRoom.setProperty('userSalavatCountIncrease', 0);
      chatRoom.setProperty('userSalavatCount', userSalavatCount);
      localStorage.setItem('userSalavatCount', userSalavatCount + '');
    }
    else {
      console.error('updateData: %s', result.description);
    }
    chatRoom.setProperty('snackbar', <SnackbarOption>{
      open: true,
      text: result.ok ?
        'نذر شما با موفقیت ثبت و اعمال شد.' :
        'خطا در ذخیره اصلاعات! لطفا وضعیت اتصال به اینترنت را بررسی کنید.',
    });
  }
});

/*
  API salavatCount
*/
const loadSalavatCountInterval = async () => {
  const salavatCountApi = await loadData<SalavatCountDataApiInterface>(appConfig.apiSalavatCountDocId);
  const salavatCount = salavatCountApi.salavatCount;
  const oldSalavatCount = chatRoom.getProperty('salavatCount') as SalavatCountInterface;
  if (salavatCount && salavatCount._lastEditedTime > (oldSalavatCount?._lastEditedTime || 0)) {
    chatRoom.setProperty('salavatCount', salavatCount);
  }
  idlePeriod.run(() => setTimeout(() => loadSalavatCountInterval(), appConfig.loadSalavatInterval));
};
idlePeriod.run(() => loadSalavatCountInterval()); // load on startup

/*
  Localstorage
*/
const parseJSON = <T>(str: string): T | null => {
  let parsed: T | null = null;
  try {
    parsed = JSON.parse(str) as T;
  }
  catch (err) {
    console.error('parseJSON: %s', str);
  }
  return parsed;
};

const localStorageGetItem = <T>(str: string, defaultValue: T): T => {
  const item: string | null = localStorage.getItem(str);
  if (item == null) return defaultValue;
  const parsed: T | null = parseJSON<T>(item);
  if (parsed == null) return defaultValue;
  else return parsed;
};

const loadFromLocalStorage = () => {
  chatRoom.setProperty('userSalavatCount', localStorageGetItem<number>('userSalavatCount', 0));

  if (localStorageGetItem<Boolean>('service-worker-updated', false)) {
    localStorage.removeItem('service-worker-updated');
    chatRoom.setProperty('snackbar', <SnackbarOption>{
      open: true,
      text: `به نسخه ${appConfig.appVersion} خوش آمدید.`,
    });
  }
};
loadFromLocalStorage();

/*
  Service Worker
*/
let refreshing = false;
chatRoom.onMessage('service-worker-updated', () => {
  if (refreshing) return;

  localStorage.setItem('service-worker-updated', 'true');

  chatRoom.setProperty('snackbar', <SnackbarOption>{
    open: true,
    text: 'در حال نصب و فعال سازی نسخه جدید برنامه ...',
    timeout: 3000,
  });

  setTimeout(() => window.location.reload(), 3500);
  refreshing = true;
});
