import 'dotenv/config';
import * as join from 'joi';

interface EnvVars {
  PORT: number;
  PRODUCTS_MICROSERVICE_HOST: string;
  PRODUCTS_MICROSERVICE_PORT: number;
  ORDERS_MICROSERVICE_HOST: string;
  ORDERS_MICROSERVICE_PORT: number;
}

const envSchema = join
  .object({
    PORT: join.number().required(),
    PRODUCTS_MICROSERVICE_HOST: join.string().required(),
    PRODUCTS_MICROSERVICE_PORT: join.number().required(),
    ORDERS_MICROSERVICE_HOST: join.string().required(),
    ORDERS_MICROSERVICE_PORT: join.number().required(),
  })
  .unknown(true);
const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
  productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
  ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
  ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
};
