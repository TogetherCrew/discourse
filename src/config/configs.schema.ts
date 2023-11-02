import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  PORT: Joi.number().default(3000),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
