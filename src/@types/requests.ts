import Quote from './quote';

export type FilmRouteBaseParams = {
  filmId: string
  quoteId: string
};

export type UpdateFilmQuotesBody = {
  title: string,
  quoteText: string,
  actor: string
};

export type ErrorReply = {
  error: string
  message: string
};

export type GetQuoteQuery = {
  language: string
};
