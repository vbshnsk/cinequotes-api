import {ClientConfig} from '@google-cloud/pubsub';
import {Settings} from '@google-cloud/firestore';

type Config = {
  firestore: FirestoreConnectionOptions,
  googlePubSub: GooglePubSubConnectionOptions
};

export type FirestoreConnectionOptions = Settings;

export type GooglePubSubConnectionOptions = ClientConfig;

export default Config;
