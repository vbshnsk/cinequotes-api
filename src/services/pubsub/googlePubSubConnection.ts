import {PubSub, Subscription, Topic} from '@google-cloud/pubsub';
import * as uuid from 'uuid';
import IPubSubConnection, {PubSubRequest} from '../../@types/pubSubConnection';

export default class GooglePubSubConnection implements IPubSubConnection {
  private _pubSub: PubSub;
  private _topic: Topic;
  private _responseSubscription: Subscription;
  private _requests: Record<string, PubSubRequest>;

  constructor(pubSub: PubSub, topic: string) {
    this._pubSub = pubSub;
    this._topic = this._pubSub.topic(topic);
    this._responseSubscription = this._topic.subscription('response');
  }

  get requestsInProgress() {
    return this._requests;
  }

  async start() {
    if (!(await this._topic.exists())[0]) {
      await this._topic.create();
    }

    if (!(await this._responseSubscription.exists())[0]) {
      await this._responseSubscription.create();
    }

    this._responseSubscription.on('message', this._onMessage.bind(this));
  }

  async stop() {
    await this._responseSubscription.delete();
  }

  async publish(data: Record<string, unknown>) {
    const requestId = uuid.v4();
    data.requestId = requestId;

    this._requests = this._requests || {};
    this._requests[requestId] = {
      timestamp: Date.now()
    };

    await this._topic.publish(Buffer.from(JSON.stringify(data)));
    return requestId;
  }

  _onMessage(message: Buffer) {
    this.onMessage(message.toString());
  }

  onMessage(message: string) {
    const {requestId} = JSON.parse(message);

    delete this._requests[requestId];
  }

}