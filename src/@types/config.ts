type Config = {
  firestore: FirestoreConnectionOptions,
  googlePubSub: GooglePubSubConnectionOptions
};

export type FirestoreConnectionOptions = {
  projectId: string
};

export type GooglePubSubConnectionOptions = {
  projectId: string
};

export default Config;
