export const defaultOpts = {
  minTime: (60 * 1000) / 200,
  reservoir: 20,
  reservoirRefreshAmount: 20,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 5,
};

export const proxyOpts = {
  minTime: (60 * 1000) / 500,
  reservoir: 500,
  reservoirRefreshAmount: 500,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 20,
};
