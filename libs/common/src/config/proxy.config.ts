export const proxyConfig = (): Record<string, unknown> => ({
  proxy: process.env.PROXY_URI,
});
