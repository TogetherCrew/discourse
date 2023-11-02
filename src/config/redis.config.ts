export default (): Record<string, unknown> => ({
  neo4j: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
