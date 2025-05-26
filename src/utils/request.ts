export const createRequestId = (): string => {
  const randomUint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return randomUint32.toString(16);
};
