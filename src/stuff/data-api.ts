import {appConfig} from '../config';

const debug = appConfig.debug;
const fetchTimeout = 15_000;
const _log = (message: unknown, ...restParam: unknown[]): void => {
  if (debug) {
    console.log(
        `%cDataAPI%c ${message}`,
        'color: #4CAF50; font-size: 1.2em;',
        'color: inherit; font-size: 1em;',
        ...restParam,
    );
  }
};

const _fetch = <T>(path: string, option: RequestInit): Promise<T> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject): Promise<void> => {
    _log('fetch: %s', path);
    let rejected = false;
    const timer = setTimeout(() => {
      rejected = true;
      reject(new Error('timeout'));
    }, fetchTimeout);
    const fetchResponse: Response = await fetch(path, option);
    if (rejected) return;
    clearTimeout(timer);
    if (!fetchResponse.ok) throw new Error('Cannot load data! ' + (await fetchResponse.text()));
    resolve((await fetchResponse.json()) as T);
  });
};

export const loadData = async <T>(docId: string): Promise<T> => {
  _log('loadData: %s', docId);
  let dataListObject: T = {} as T;
  try {
    dataListObject = await _fetch<T>(`${appConfig.apiUri}/data/${docId}.json?pwa`, {method: 'GET'});
  } catch (err) {
    _log('ERROR: %o', err);
  }
  return dataListObject;
};

export interface UpdateResponse<T> {
  ok: boolean;
  description: string;
  data?: T;
  apiVersion?: string;
}

export const updateData = async <T>(
  docId: string,
  dataApiItem: Partial<T>,
  token: string = appConfig.apiToken,
): Promise<UpdateResponse<T>> => {
  _log('updateData %s with %o', docId, dataApiItem);
  const dataApiItemCopy: Record<string, unknown> = {...dataApiItem};

  delete dataApiItemCopy._owner;
  delete dataApiItemCopy._createdTime;
  delete dataApiItemCopy._lastEditedTime;
  delete dataApiItemCopy._lastEditedBy;

  try {
    return await _fetch<UpdateResponse<T>>(`${appConfig.apiUri}/v1/update-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
      body: JSON.stringify({
        docId,
        token,
        data: dataApiItemCopy,
      }),
    });
  } catch (err) {
    _log('updateData Error: %o', err);
    return {
      ok: false,
      description: err + '',
    };
  }
};
