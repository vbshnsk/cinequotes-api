import fp from 'fastify-plugin';
import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import Validator from './validator';

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Started plugins registration');
  fastify.decorate('validator', new Validator());
  fastify.log.info('Finished validator registration');
  fastify.log.info('Finished plugins registration');
};

export default fp(plugin);