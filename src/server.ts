import register from './register';
import fastify from 'fastify';
import * as dotenv from 'dotenv';

const server = fastify({logger: true});

export const start = async () => {
  dotenv.config();
  server.register(register);
  await server.ready();
  await server.store.connect();
  await server.translationClient.start();
  return server;
};

export const startForTests = async () => {
  server.register(register);
  await server.ready();
  return server;
};

export default server;