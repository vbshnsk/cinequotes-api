import IDatastoreConnection from './datastoreConnection';
import Config from './config';
import Validator from '../plugins/validator';

declare module 'fastify' {

  export interface FastifyInstance {
    store: IDatastoreConnection
    config: Config
    validator: Validator
  }
}
