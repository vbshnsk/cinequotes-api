import register from './register';
import fastify from 'fastify';

const server = fastify({logger: true});

export const start = async () => {
  server.register(register);
  await server.ready();
  await server.store.connect();
  return server;
};

export default server;