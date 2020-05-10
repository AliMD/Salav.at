const dispatchJobList: Record<string, boolean> = {};

export const isRepeated = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (dispatchJobList[id]) {
      resolve(true); // you are repeated not first one
    }
    else {
      // you are the first one not repeated
      dispatchJobList[id] = true;
      window.requestAnimationFrame(() => {
        delete dispatchJobList[id];
        resolve(false); // no you are not repeated.
      });
    }
  });
}
