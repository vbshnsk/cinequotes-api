import {FastifyInstance, FastifyPluginOptions} from 'fastify';
import quotes from './quotes';
import {ErrorReply, FilmRouteBaseParams, UpdateFilmQuotesBody} from '../../@types/requests';
import {updateFilm} from './schema';
import {Film} from '../../@types/films';
import Quote from '../../@types/quote';

const plugin = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {

  fastify.log.info('Registering /films routes');
  fastify.register(async (fastify, opts) => {

    fastify.log.info('Registering /films/:filmId routes');
    fastify.register(async (fastify, opts) => {

      fastify.log.info('Registering /films/:filmId prehook');
      fastify.addHook<{
        Params: Pick<FilmRouteBaseParams, 'filmId'>,
        Reply: ErrorReply
      }>('preHandler', async (req, rep) => {
        if (!fastify.validator.isUUID(req.params.filmId)) {
          rep.code(400);
          rep.send({
            error: 'ValidationError',
            message: 'filmId must be in form of uuid'
          });
        }
      });

      fastify.log.info('Registering /films/:filmId/quotes routes');
      fastify.register(quotes);

    },{prefix: '/:filmId'});
    fastify.log.info('Finished registering /films/:filmId/ routes');

    fastify.log.info('Registering GET: /films route');
    fastify.get<{
      Reply: Array<Pick<Film, 'id' | 'title'>>
    }>('/', {},
      async (req, rep) => {
        const films = await fastify.store.films.getAllMetadata();
        rep.code(200);
        rep.send(films);
      });

    fastify.log.info('Registering PUT: /films route');
    fastify.put<{
      Body: UpdateFilmQuotesBody,
      Reply: {film: Pick<Film, 'id' | 'title'>, quotes: Array<Pick<Quote, 'id' | 'text'>>}
    }>('/', {
      schema: updateFilm
    }, async (req, rep) => {
      const {title, actor, quoteText} = req.body;
      const {updated, quoteId} = await fastify.store.films.addQuote(title, actor, quoteText);
      await fastify.translationClient.requestTranslation(updated.id, quoteId, quoteText);
      rep.code(201);
      rep.send({
        film: {
          id: updated.id,
          title: updated.title
        },
        quotes: updated.quotes.map(v => {
          return {
            id: v.id,
            text: v.text
          };
        })
      });
    });

    fastify.log.info('Finished registering /films routes');
  }, {prefix: '/films'});
};

export default plugin;