import Quote, {FirestoreQuoteModel} from './quote';

export type Film = {
  id?: string
  title: string
  quotes: Array<Quote>
};

export type FirestoreFilmModel = {
  id?: string
  title: string
  quotes: Array<FirestoreQuoteModel>
};

export default interface IFilms {
  getAllMetadata: () => Promise<Array<Pick<Film, 'id' | 'title'>>>
  getQuotesById: (id: string, language?: string) => Promise<Array<Pick<Quote, 'id' | 'text'>>>
  getQuoteMetadataById: (filmId: string, quoteId: string, language?: string) => Promise<Quote>
  addQuote: (title: string, actorName: string, quoteText: string) => Promise<FirestoreFilmModel>
}