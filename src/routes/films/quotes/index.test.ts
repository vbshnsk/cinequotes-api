import {FastifyInstance} from 'fastify';
import {startForTests} from '../../../server';
import * as sinon from 'sinon';
import {SinonSandbox, SinonStub} from 'sinon';


describe('/quotes', () => {
  let server: FastifyInstance;
  let sandbox: SinonSandbox;

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    server = await startForTests();
  });

  afterEach(() => {
    sandbox.restore();
  });

  let validationStub: SinonStub;

  beforeEach(() => {
    validationStub = sandbox.stub(server.validator, 'isUUID')
      .returns(true);
  });

  describe('/:quoteId', () => {

    describe('PREHOOK', () => {
      it('should not accept invalid quoteId', async () => {
        validationStub.withArgs('quoteId')
          .returns(false);

        const res = await server.inject({
          method: 'get',
          url: '/films/filmId/quotes/quoteId'
        });

        expect(res.json()).toMatchObject({error: 'ValidationError', message: 'quoteId must be in form of uuid'});
        expect(res.statusCode).toBe(400);
      });
    });

    describe('GET: /', () => {

      it('should get quote data if it exists', async () => {
        sandbox.stub(server.store.films, 'getQuoteMetadataById')
          .resolves({id: 'id', text: 'quote', actor: {name: 'actor'}});

        const res = await server.inject({
          method: 'get',
          url: '/films/filmId/quotes/quoteId'
        });

        expect(res.json()).toMatchObject({
          id: 'id',
          text: 'quote',
          actor: {
            name: 'actor'
          }
        });
        expect(res.statusCode).toBe(200);
      });
    });

    it('should return error if quote does not exist', async () => {
      sandbox.stub(server.store.films, 'getQuoteMetadataById')
        .resolves(null);

      const res = await server.inject({
        method: 'get',
        url: '/films/filmId/quotes/quoteId'
      });

      expect(res.json()).toMatchObject({
        error: 'NotFoundError'
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET: /', () => {
    it('should get all quotes if film exists', async () => {
      sandbox.stub(server.store.films, 'getQuotesById')
        .resolves([{id: 'id', text: 'quote'}, {id: 'id2', text: 'quote'}]);

      const res = await server.inject({
        method: 'get',
        url: '/films/filmId/quotes'
      });

      expect(res.json()).toMatchObject([
        {
          id: 'id',
          text: 'quote'
        },
        {
          id: 'id2',
          text: 'quote'
        }
      ]);

      expect(res.statusCode).toBe(200);
    });

    it('should return error if film does not exist', async () => {
      sandbox.stub(server.store.films, 'getQuotesById')
        .resolves(null);

      const res = await server.inject({
        method: 'get',
        url: '/films/filmId/quotes'
      });

      expect(res.json()).toMatchObject({
        error: 'NotFoundError'
      });
      expect(res.statusCode).toBe(404);
    });
  });

});