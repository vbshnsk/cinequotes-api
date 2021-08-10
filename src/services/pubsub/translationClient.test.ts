import TranslationClient from './translationClient';
import {PubSub} from '@google-cloud/pubsub';
import IPubSubConnection from '../../@types/pubSubConnection';
import GooglePubSubConnection from './googlePubSubConnection';
import config from '../../config';
import * as grpc from '@grpc/grpc-js';

describe('Translation pub sub client', () => {

  let client: TranslationClient;
  let con: IPubSubConnection;
  let reqId: string;

  beforeAll(async () => {
    const conf = Object.assign({}, config.googlePubSub);
    const [pubSubHost, pubSubPort] = process.env.PUBSUB_EMULATOR_HOST.split(':');
    conf.servicePath = pubSubHost;
    conf.port = pubSubPort;
    conf.sslCreds = grpc.credentials.createInsecure();
    const pubSub = new PubSub(conf);
    con = new GooglePubSubConnection(pubSub, 'translate');
    client = new TranslationClient(con);
    await client.start();

  });

  afterAll(async () => {
    await client.stop();
  });

  afterEach(() => {
    con.onMessage(JSON.stringify({requestId: reqId}));
  });

  it('should send translation request', async () => {
    reqId = await client.requestTranslation('id', 'id', 'translate');
    expect(con.requestsInProgress[reqId]).toBeDefined();
  });

});