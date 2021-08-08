import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import {getAll, getById} from './schema';
import {ErrorReply, FilmRouteBaseParams} from '../../../@types/requests';
import Quote from '../../../@types/quote';

const plugin = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.register(async (fastify, opts) => {
    fastify.register(async (fastify, opts) => {
      fastify.addHook<{
        Params: Pick<FilmRouteBaseParams, 'quoteId'>,
        Reply: ErrorReply
      }>('preHandler', async (req, rep) => {
        console.log(req.params);
        if (!fastify.validator.isUUID(req.params.quoteId)) {
          rep.code(400);
          rep.send({
            error: 'ValidationError',
            message: 'quoteId must be in form of uuid'
          });
        }
      });

      fastify.get<{
        Params: FilmRouteBaseParams,
        Reply: ErrorReply | Quote
      }>('/', {
        schema: getById
      }, async (req, rep) => {
        const {filmId, quoteId} = req.params;
        const quote = await fastify.store.films.getQuoteMetadataById(filmId, quoteId);
        if (quote) {
          rep.code(200);
          rep.send(quote);
          return;
        }
        rep.code(404);
        rep.send({
          error: 'NotFoundError',
          message: 'Quote does not exist for that query'
        });
      });
    }, {prefix: '/:quoteId'});

    fastify.get<{
      Params: Pick<FilmRouteBaseParams, 'filmId'>,
      Reply: ErrorReply | Array<Pick<Quote, 'id' | 'text'>>
    }>('/', {
      schema: getAll
    }, async (req, rep) => {
      const {filmId} = req.params;
      const quotes = await fastify.store.films.getQuotesById(filmId);
      if (quotes) {
        rep.code(200);
        rep.send(quotes);
        return;
      }
      rep.code(404);
      rep.send({
        error: 'NotFoundError',
        message: 'Film not found by that ID'
      });
    });

  },{prefix: '/quotes'});
};

export default plugin;