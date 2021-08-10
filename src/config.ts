import Config from './@types/config';

const config: Config = {
  firestore: {
    projectId: process.env.FIREBASE_PROJECT_ID || 'dummy'
  },
  googlePubSub: {
    projectId: process.env.PUBSUB_PROJECT_ID || 'dummy'
  }
};

export default config;
