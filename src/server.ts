import register from './register';
import fastify from 'fastify';

const server = fastify({logger: true});

export const start = async () => {
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