import {Message, PubSub, Subscription, Topic} from '@google-cloud/pubsub';
import * as uuid from 'uuid';
import IPubSubConnection, {PubSubRequest} from '../../@types/pubSubConnection';

export default class GooglePubSubConnection implements IPubSubConnection {
  private _pubSub: PubSub;
  private _topic: Topic;
  private _requestSubscription: Subscription;
  private readonly _requests: Record<string, PubSubRequest>;

  constructor(pubSub: PubSub, topic: string) {
    this._pubSub = pubSub;
    this._topic = this._pubSub.topic(topic);
    this._requestSubscription = this._topic.subscription('request');
    this._requests = {};
  }

  get requestsInProgress() {
    return this._requests;
  }

  async start() {
    if (!(await this._topic.exists())[0]) {
      await this._topic.create();
    }

    if (!(await this._requestSubscription.exists())[0]) {
      await this._requestSubscription.create();
    }

    this._requestSubscription.on('message', this._onMessage.bind(this));
  }

  async stop() {
    await this._requestSubscription.delete();
  }

  async publish(data: Record<string, unknown>) {
    const requestId = uuid.v4();
    data.requestId = requestId;

    this._requests[requestId] = {
      timestamp: Date.now()
    };

    await this._topic.publish(Buffer.from(JSON.stringify(data)));
    return requestId;
  }

  private _onMessage(message: Message) {
    this.onMessage(message.data.toString());
    message.ack();
  }

  onMessage(message: string) {
    const {requestId} = JSON.parse(message);

    delete this._requests[requestId];
  }

}
