import IPubSubConnection from '../../@types/pubSubConnection';

export default class TranslationClient {
  private _connection: IPubSubConnection;

  constructor(connection: IPubSubConnection) {
    this._connection = connection;
  }

  async start(): Promise<void> {
    await this._connection.start();
  }

  async stop(): Promise<void> {
    await this._connection.stop();
  }

  requestTranslation(filmId: string, quoteId: string, text: string) {
    return this._connection.publish({
      requestType: 'setTranslation',
      filmId,
      quoteId,
      text
    });
  }

}