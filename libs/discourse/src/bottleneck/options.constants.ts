export const defaultOpts = {
  minTime: (60 * 1000) / 200,
  reservoir: 20,
  reservoirRefreshAmount: 20,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 5,
};

export const proxyOpts = {
  minTime: (60 * 1000) / 1000,
  reservoir: 1000,
  reservoirRefreshAmount: 1000,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 1000,
};
