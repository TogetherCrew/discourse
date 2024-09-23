export const rmqConfig = (): Record<string, unknown> => ({
  rmq: {
    host: process.env.RMQ_HOST,
    port: process.env.RMQ_PORT,
    user: process.env.RMQ_USER,
    pass: process.env.RMQ_PASS,
    uri: [
      'amqp://',
      process.env.RMQ_USER,
      ':',
      process.env.RMQ_PASS,
      '@',
      process.env.RMQ_HOST,
      ':',
      process.env.RMQ_PORT,
    ].join(''),
  },
});
