export default (): Record<string, unknown> => ({
  proxy: process.env.PROXY_URI,
});
