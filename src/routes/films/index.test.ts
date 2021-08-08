import {FastifyInstance} from 'fastify';
import {start} from '../../server';
import * as sinon from 'sinon';
import {SinonSandbox, SinonStub} from 'sinon';


describe('/films', () => {
  let server: FastifyInstance;
  let sandbox: SinonSandbox;

  beforeAll(async () => {
    server = await start();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  let validationStub: SinonStub;

  beforeEach(() => {
    validationStub = sandbox.stub(server.validator, 'isUUID')
      .returns(true);
  });

  describe('/:filmId', () => {

    describe('PREHOOK', () => {
      it('should not accept invalid filmId', async () => {
        validationStub.withArgs('filmId')
          .returns(false);

        const res = await server.inject({
          method: 'get',
          url: '/films/filmId/quotes'
        });

        expect(res.json()).toMatchObject({error: 'ValidationError', message: 'filmId must be in form of uuid'});
        expect(res.statusCode).toBe(400);
      });
    });
  });

  describe('GET: /', () => {

    it('should get all film data', async () => {
      sandbox.stub(server.store.films, 'getAllMetadata')
        .resolves([{id: 'id', title: 'title'}, {id: 'id2', title: 'title2'}]);

      const res = await server.inject({
        method: 'get',
        url: '/films'
      });

      expect(res.json()).toMatchObject([
        {
          id: 'id',
          title: 'title'
        },
        {
          id: 'id2',
          title: 'title2'
        }
      ]);
      expect(res.statusCode).toBe(200);
    });

  });

  describe('PUT: /', () => {

    it('should update quotes for a movie', async () => {
      sandbox.stub(server.store.films, 'addQuote')
        .resolves({
          id: 'id',
          title: 'title',
          quotes: [{
            id: 'id',
            text: 'text',
            actorRef: 'actorId'
          }]
        });

      const res = await server.inject({
        method: 'put',
        url: '/films',
        payload: {
          title: 'title',
          actor: 'actor',
          quoteText: 'text'
        }
      });

      expect(res.json()).toMatchObject({
        film: {
          id: 'id',
          title: 'title'
        },
        quotes: [{
          id: 'id',
          text: 'text'
        }]
      });
      expect(res.statusCode).toBe(201);
    });

  });

});