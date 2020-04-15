import { appConfig } from '../config';

const debug = true;
const fetchTimeout = 15_000;
const _log = (message: unknown, ...restParam: unknown[]) => {
  if (debug) {
    console.log(`%cDataAPI%c ${message}`, "color: #4CAF50; font-size: 1.2em;", "color: inherit;font-size: 1em", ...restParam);
  }
};

const _fetch = <T>(path: string, option: RequestInit): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    _log('fetch: %s', path);
    let rejected: boolean = false;
    const timer = setTimeout(() => {
      rejected = true;
      reject('timeout');
    }, fetchTimeout);
    const fetchResponse: Response = await fetch(path, option);
    if (rejected) return;
    clearTimeout(timer);
    if(!fetchResponse.ok) throw 'Cannot load data! ' + await fetchResponse.text()
    resolve(await fetchResponse.json() as T);
  });
};

export const loadData = async <T>(docId: string): Promise<T> => {
  _log('loadData: %s', docId);
  let dataListObject: T = {} as T;
  try {
    dataListObject = await _fetch<T>(`${appConfig.apiUri}/data/${docId}.json?pwa`, { method: 'GET' });
  }
  catch (err) {
    _log('ERROR: %o', err);
  }
  return dataListObject;
};

export interface UpdateResponse<T> {
  ok: boolean,
  description: string,
  data: T,
  apiVersion: string,
}

export const updateData = <T>(docId: string, dataApiItem: Partial<T>, token: string = appConfig.apiToken): Promise<UpdateResponse<T>> => {
    _log('updateData %s with %o', docId, dataApiItem);
    const dataApiItemCopy: any = { ...dataApiItem };

    delete dataApiItemCopy._owner;
    delete dataApiItemCopy._createdTime;
    delete dataApiItemCopy._lastEditedTime;
    delete dataApiItemCopy._lastEditedBy;

  return _fetch<UpdateResponse<T>>(`${appConfig.apiUri}/v1/update-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify({
        docId,
        token,
        data: dataApiItemCopy,
      })
    });
}
