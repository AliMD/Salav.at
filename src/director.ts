import './stuff/director-assistant';
import { chatRoom } from './stuff/chat-room';
import { pageListArray, appConfig, SalavatCountInterface, SalavatCountDataApiInterface } from './config';
import { SnackbarOption } from './stuff/snack-bar';
import { idlePeriod } from '@polymer/polymer/lib/utils/async';
import { loadData, updateData } from './stuff/data-api';
import { localStorageGetItem } from './stuff/director-assistant';

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
chatRoom.onMessage('app-installable', () => {
  if (window.innerWidth > appConfig.maxWith) {
    chatRoom.postMessage('request-install');
  }
});

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

// fixWindowSize

const fixWindowSize = () => {
  if (window.innerWidth >= appConfig.maxWith) {
    idlePeriod.run(() => {
      window.resizeTo(414, 736); // iPhone 8 plus
    });
  }
}

chatRoom.onMessage('app-installed', fixWindowSize); // after install
chatRoom.onMessage('window-loaded-standalone', fixWindowSize);

/*
  testMode
*/
let testMode = location.host.indexOf('localhost') === 0;
if (testMode) chatRoom.setProperty('testMode', testMode);

chatRoom.onPropertyChanged('testMode', async (_testMode: boolean | unknown) => {
  testMode = Boolean(_testMode);

  loadFromLocalStorage();
  await loadSalavatCount(/* force: */ true);
  chatRoom.postMessage('skipCountAnimation');

  if (testMode as boolean) {
    chatRoom.setProperty('snackbar', <SnackbarOption>{
      open: true,
      text: 'حالت تست فعال شد!',
    });
  }
  else {
    chatRoom.setProperty('snackbar', <SnackbarOption>{
      open: true,
      text: 'حالت تست غیر فعال شد!',
    });
  }
});

/*
  cheat for testMode
*/

let lastCheatClickTime = 0;
let cheatClickCount = 0;
chatRoom.onMessage('cheatClick', () => {
  const now = Date.now();
  const duration = now - lastCheatClickTime;
  lastCheatClickTime = now;

  if (duration > 2_000) {
    cheatClickCount = 0;
    if (testMode) chatRoom.setProperty('testMode', false);
  }

  if (duration < 400) {
    cheatClickCount++;
  }
  else {
    cheatClickCount = 0;
  }

  if (cheatClickCount > 7) {
    chatRoom.setProperty('testMode', true);
    cheatClickCount = 0;
  }
});

// calc sliderMax
export const calcSliderMax = (sliderValue: number) => {
  for (const max of appConfig.sliderMaxRangeList) {
    if (sliderValue >= max * 0.8) continue;
    chatRoom.setProperty('sliderMax', max);
    break;
  }
}

chatRoom.onPropertyChanged('userSalavatCount', (userSalavatCount: number | unknown) => {
  calcSliderMax(userSalavatCount as number);
});

/*
  user salavat count ....
*/
chatRoom.onPropertyChanged('userSalavatCountIncrease', (userSalavatCountIncrease: number | unknown) => {
  const showSubmit: boolean = userSalavatCountIncrease as number > 0;
  if (chatRoom.getProperty('showSubmit') != showSubmit) {
    chatRoom.setProperty('showSubmit', showSubmit);
  }
});

let saving = false;
chatRoom.onMessage('submit-salavat', async () => {
  if (saving) return;
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
    saving = true;
    chatRoom.setProperty('snackbar', <SnackbarOption>{
      open: true,
      text: 'در حال ذخیره کردن ...',
      timeout: 10_000,
    });
    const result = await updateData<SalavatCountInterface>(testMode ? appConfig.apiSalavatTestDocId : appConfig.apiSalavatCountDocId, { _id: 'salavatCount', count: userSalavatCountIncrease })
    saving = false;
    if (result.ok) {
      userSalavatCount += userSalavatCountIncrease;
      chatRoom.setProperty('salavatCount', result.data);
      chatRoom.setProperty('userSalavatCountIncrease', 0);
      chatRoom.setProperty('userSalavatCount', userSalavatCount);

      chatRoom.setProperty('snackbar', <SnackbarOption>{
        open: true,
        text: 'نذر شما با موفقیت ثبت و اعمال شد.',
      });
    }
    else {
      console.error('updateData: %s', result.description);
      chatRoom.setProperty('snackbar', <SnackbarOption>{
        open: true,
        text: 'خطا در ذخیره اصلاعات! لطفا وضعیت اتصال به اینترنت را بررسی کنید.',
      });
    }

  }
});

/*
  API salavatCount
*/
const loadSalavatCount = async (force: boolean = false) => {
  const salavatCountApi = await loadData<SalavatCountDataApiInterface>(testMode ? appConfig.apiSalavatTestDocId : appConfig.apiSalavatCountDocId);
  const salavatCount = salavatCountApi.salavatCount;
  const oldSalavatCount = chatRoom.getProperty('salavatCount') as SalavatCountInterface;
  if (salavatCount && (force || salavatCount._lastEditedTime > (oldSalavatCount?._lastEditedTime || 0) ) ) {
    chatRoom.setProperty('salavatCount', salavatCount);
  }
}

const loadSalavatCountInterval = async () => {
  await loadSalavatCount();
  idlePeriod.run(() => setTimeout(() => loadSalavatCountInterval(), appConfig.loadSalavatInterval));
};

loadSalavatCountInterval(); // load on startup

/*
  Local storage
*/

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

chatRoom.onPropertyChanged('userSalavatCount', (userSalavatCount: number | unknown) => {
  if (testMode) return;
  localStorage.setItem('userSalavatCount', userSalavatCount + '');
});

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
  });

  setTimeout(() => window.location.reload(), 3_000);
  refreshing = true;
});
