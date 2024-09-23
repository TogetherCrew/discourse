import * as Joi from 'joi';

export const schemaConfig = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  PORT: Joi.number().default(3000),

  NEO4J_HOST: Joi.string().required(),
  NEO4J_PORT: Joi.number().required(),
  NEO4J_USERNAME: Joi.string().required(),
  NEO4J_PASSWORD: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  PROXY_URI: Joi.string().optional(),

  RMQ_HOST: Joi.string().required(),
  RMQ_PORT: Joi.number().default(5672),
  RMQ_USER: Joi.string().required(),
  RMQ_PASS: Joi.string().required(),
});
