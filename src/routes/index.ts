import fp from 'fastify-plugin';
import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import films from './films';

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Started routes registration');
  fastify.register(films);
  fastify.log.info('Finished routes registration');
};

export default fp(plugin);