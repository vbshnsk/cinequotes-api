import FirestoreConnection from './index';

describe('Films queries', () => {
  const store = new FirestoreConnection({
    projectId: 'dummy'
  });

  beforeAll(async () => {
    await store.connect();
  });

  afterAll(async () => {
    await store.disconnect();
  });

  afterEach(async () => {
    await store.flush();
  });

  describe('getAllMetadata', () => {

    beforeEach(async () => {
      await store.insertAt('films', 'id', {id: 'id', title: 'title', quotes: []});
      await store.insertAt('films', 'id1', {id: 'id1', title: 'title1', quotes: []});
    });

    it('should get all metadata', async () => {
      const data = await store.films.getAllMetadata();
      expect(data).toMatchObject([
        {
          id: 'id',
          title: 'title'
        },
        {
          id: 'id1',
          title: 'title1'
        }
      ]);
    });

    it('should return empty array when no films are in storage', async () => {
      await store.flush();
      const data = await store.films.getAllMetadata();
      expect(data).toMatchObject([]);
    });

  });

  describe('getQuoteMetadataById', () => {

    it('should get quote by id when available', async () => {
      const filmData = {
        id: 'id',
        title: 'title',
        quotes: [{
          id: 'id',
          text: 'text',
          actorRef: 'actorId'
        }]
      };
      await store.insertAt('films', 'id', filmData);
      await store.insertAt('actors', 'actorId', {id: 'actorId', name: 'actor'});

      const data = await store.films.getQuoteMetadataById('id', 'id');
      expect(data).toMatchObject({
        id: 'id',
        text: 'text',
        actor: {
          id: 'actorId',
          name: 'actor'
        }
      });
    });

    it('should return translation when available', async () => {
      const filmData = {
        id: 'id',
        title: 'title',
        quotes: [{
          id: 'id',
          text: 'text',
          actorRef: 'actorId',
          translations: {
            fr: 'translation'
          }
        }]
      };
      await store.insertAt('films', 'id', filmData);
      await store.insertAt('actors', 'actorId', {id: 'actorId', name: 'actor'});

      const data = await store.films.getQuoteMetadataById('id', 'id', 'fr');
      expect(data).toMatchObject({
        id: 'id',
        text: 'translation',
        actor: {
          id: 'actorId',
          name: 'actor'
        }
      });
    });

    it('should return null when quote not available by id', async () => {
      const filmData = {
        id: 'id',
        title: 'title',
        quotes: []
      };
      await store.insertAt('films', 'id', filmData);

      const data = await store.films.getQuoteMetadataById('id', 'id');
      expect(data).toBeNull();
    });

    it('should return null when film not available by id', async () => {
      const data = await store.films.getQuoteMetadataById('id', 'id');
      expect(data).toBeNull();
    });

  });

  describe('getQuotesById', () => {

    it('should get film quotes by id when film is available', async () => {
      const filmData = {
        id: 'id',
        title: 'title',
        quotes: [{
          id: 'id',
          text: 'text',
          actorRef: 'actorId'
        }]
      };
      await store.insertAt('films', 'id', filmData);

      const data = await store.films.getQuotesById('id');
      expect(data).toMatchObject([{
        id: 'id',
        text: 'text'
      }]);
    });

    it('should not get null when film is not available', async () => {
      const data = await store.films.getQuotesById('id');
      expect(data).toBeNull();
    });

  });

  describe('addQuote', () => {

    it('should add quote with existing film and actor', async () => {
      const filmData = {
        id: 'id',
        title: 'title',
        quotes: []
      };

      await store.insertAt('films', 'id', filmData);
      await store.insertAt('actors', 'id', {id: 'actorId', name: 'actor'});

      const res = await store.films.addQuote('title', 'actor', 'new quote');

      expect(res).toMatchObject({
        id: 'id',
        title: 'title',
        quotes: [{
          text: 'new quote'
        }]
      });
    });

    it('should add quote with not existing film', async () => {
      await store.insertAt('actors', 'id', {id: 'actorId', name: 'actor'});

      const res = await store.films.addQuote('title', 'actor', 'new quote');

      expect(res).toMatchObject({
        title: 'title',
        quotes: [{
          text: 'new quote'
        }]
      });
    });

    it('should add quote with not existing actor', async () => {
      const res = await store.films.addQuote('title', 'actor', 'new quote');

      expect(res).toMatchObject({
        title: 'title',
        quotes: [{
          text: 'new quote'
        }]
      });

      const quote = await store.films.getQuoteMetadataById(res.id, res.quotes[0].id);
      expect(quote.actor).toMatchObject({name: 'actor'});
    });

  });

});
