import FirestoreConnection from './firestore';
import fp from 'fastify-plugin';
import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import {PubSub} from '@google-cloud/pubsub';
import {TranslationClient} from './pubsub';
import GooglePubSubConnection from './pubsub/googlePubSubConnection';

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Started services registration');
  fastify.decorate('store', new FirestoreConnection(fastify.config.firestore));
  fastify.log.info('Firestore registered');

  const pubSub = new PubSub(fastify.config.googlePubSub);
  const translationPubSub = new GooglePubSubConnection(pubSub, 'translate');
  fastify.decorate('translationClient', new TranslationClient(translationPubSub));
  fastify.log.info('Translation worker client registered');
  fastify.log.info('Finished services registration');
};

export default fp(plugin);