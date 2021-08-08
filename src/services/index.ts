import FirestoreConnection from './firestore';
import fp from 'fastify-plugin';
import {FastifyInstance, FastifyPluginOptions} from 'fastify';

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Started services registration');
  fastify.decorate('store', new FirestoreConnection(fastify.config.firestore));
  fastify.log.info('Firestore registered');
  fastify.log.info('Finished services registration');
};

export default fp(plugin);