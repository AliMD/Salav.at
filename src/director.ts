import './stuff/director-assistant';
import { chatRoom } from './stuff/chat-room';
import { pageListArray } from './config';

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
