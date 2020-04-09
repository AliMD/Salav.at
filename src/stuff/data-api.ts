import { appConfig } from '../config';



const debug = true;
const _log = (message: unknown, ...restParam: unknown[]) => {
  if (debug) {
    console.log(`%cChatRoom%c ${message}`, "color: #4CAF50; font-size: 1.2em;", "color: inherit;font-size: 1em", ...restParam);
  }
};

const _fetch = async <T>(path: string, option: RequestInit): Promise<T> => {
  _log('fetch: %s', path);
  const fetchResponse: Response = await fetch(path, option);
  if(!fetchResponse.ok) throw 'Cannot load data! ' + await fetchResponse.text()
  return await fetchResponse.json() as T;
};

export const loadData = async <T>(docId: string): Promise<T> => {
  _log('loadData: %s', docId);
  let dataListObject: T = {} as T;
  try {
    dataListObject = await _fetch<T>(`${appConfig.apiUri}/data/${docId}.json`, { method: 'GET' });
  }
  catch (error) {
    _log('ERROR: %o', error);
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
