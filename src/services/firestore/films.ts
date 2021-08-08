import IFilms, {Film, FirestoreFilmModel} from '../../@types/films';
import {CollectionReference, Firestore} from '@google-cloud/firestore';
import Quote, {FirestoreQuoteModel} from '../../@types/quote';
import {FirestoreActorModel} from '../../@types/actors';
import uuid from 'uuid';

export default class FirestoreFilms implements IFilms {
  private _filmsRef: CollectionReference<FirestoreFilmModel>;
  private _actorsRef: CollectionReference<FirestoreActorModel>;
  private _firestore: Firestore;

  constructor(
    firestore: Firestore,
    filmsRef: CollectionReference<FirestoreFilmModel>,
    actorsRef: CollectionReference<FirestoreActorModel>
  ) {
    this._firestore = firestore;
    this._filmsRef = filmsRef;
    this._actorsRef = actorsRef;
  }

  async getAllMetadata(): Promise<Array<Pick<Film, 'id' | 'title'>>> {
    const {docs} = await this._filmsRef.get();
    return docs.map(v => {
      return {
        id: v.get('id'),
        title: v.get('title')
      };
    });
  }

  async getQuotesById(id: string): Promise<Array<Pick<Quote, 'id' | 'text'>>> {
    const {quotes} = (await this._filmsRef.doc(id).get()).data() || {};
    if (quotes) {
      return quotes.map(v => {
        return {
          text: v.text,
          id: v.id
        };
      });
    }
    return null;
  }

  async getQuoteMetadataById(filmId: string, quoteId: string): Promise<Quote> {
    const {quotes} = (await this._filmsRef.doc(filmId).get()).data() || {quotes: []};
    const quote = quotes.find(v => v.id === quoteId);
    if (quote) {
      const actor = (await this._actorsRef.doc(quote.actorRef).get()).data();
      return {
        id: quote.id,
        text: quote.text,
        actor
      };
    }
    return null;
  }

  async addQuote(title: string, actorName: string, quoteText: string): Promise<FirestoreFilmModel> {
    const [actor] = (await this._actorsRef.where('name', '==', actorName).get()).docs;
    let actorId: string;
    if (!actor) {
      actorId = (await this._actorsRef.add({name: actorName})).id;
    }
    else {
      actorId = actor.data().id;
    }
    const quote = {
      id: uuid.v4(),
      text: quoteText,
      actorRef: actorId
    };
    const film = (await this._firestore.runTransaction(async transaction => {
      const [film] = (await transaction.get(this._filmsRef.where('title', '==', title))).docs;
      if (film) {
        const quotes = [...film.data().quotes, quote];
        transaction.update(this._filmsRef.doc(film.data().id), {quotes});
      }
      else {
        transaction.set(this._filmsRef.doc(), {
          title,
          quotes: [quote]
        });
      }
      return film;
    })).data();
    delete quote.actorRef;
    film.quotes.push(quote);
    return film;
  }

}
