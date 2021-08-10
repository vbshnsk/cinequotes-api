import FirestoreConnection from './firestore';
import fp from 'fastify-plugin';
import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import {PubSub} from '@google-cloud/pubsub';
import {TranslationClient} from './pubsub';
import GooglePubSubConnection from './pubsub/googlePubSubConnection';
import config from '../config';
import * as grpc from '@grpc/grpc-js';

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Started services registration');
  fastify.decorate('store', new FirestoreConnection(fastify.config.firestore));
  fastify.log.info('Firestore registered');

  const pubSubConf = Object.assign({}, config.googlePubSub);
  pubSubConf.sslCreds = pubSubConf.sslCreds || grpc.credentials.createInsecure();
  if (process.env.PUBSUB_EMULATOR_HOST) {
    const [pubSubHost, pubSubPort] = process.env.PUBSUB_EMULATOR_HOST.split(':');
    pubSubConf.servicePath = pubSubHost;
    pubSubConf.port = pubSubPort;
  }

  const pubSub = new PubSub(fastify.config.googlePubSub);
  const translationPubSub = new GooglePubSubConnection(pubSub, 'translate');
  fastify.decorate('translationClient', new TranslationClient(translationPubSub));
  fastify.log.info('Translation worker client registered');
  fastify.log.info('Finished services registration');
};

export default fp(plugin);