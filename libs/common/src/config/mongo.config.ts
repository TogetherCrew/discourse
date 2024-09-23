export const mongoConfig = (): Record<string, unknown> => ({
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    uri: [
      'mongodb://',
      process.env.MONGO_USER,
      ':',
      process.env.MONGO_PASS,
      '@',
      process.env.MONGO_HOST,
      ':',
      process.env.MONGO_PORT,
    ].join(''),
  },
});
