const dispatchJobList: Record<string, boolean> = {};
export const isRepeated = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (dispatchJobList[id]) {
      resolve(true); // you are repeated not first one
    }
    else {
      dispatchJobList[id] = true;
      window.requestAnimationFrame(() => {
        delete dispatchJobList[id];
        resolve(false); // you are the first one not repeated
      });
    }
  });
}
