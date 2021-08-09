import IFilms, {Film, FirestoreFilmModel} from '../../@types/films';
import {CollectionReference, Firestore} from '@google-cloud/firestore';
import Quote, {FirestoreQuoteModel} from '../../@types/quote';
import {FirestoreActorModel} from '../../@types/actors';
import * as uuid from 'uuid';

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

  async getQuotesById(id: string, language = 'en'): Promise<Array<Pick<Quote, 'id' | 'text'>>> {
    const {quotes} = (await this._filmsRef.doc(id).get()).data() || {};
    if (quotes) {
      return quotes.map(v => {
        const text = (v.translations || {})[language] || v.text;
        return {
          text,
          id: v.id
        };
      });
    }
    return null;
  }

  async getQuoteMetadataById(filmId: string, quoteId: string, language= 'en'): Promise<Quote> {
    const res = await this._filmsRef.doc(filmId).get();
    const {quotes} = res.exists ? res.data() : {quotes: []};
    const quote: FirestoreQuoteModel = quotes.find(v => v.id === quoteId);
    if (quote) {
      const actor = (await this._actorsRef.doc(quote.actorRef).get()).data();
      const text = (quote.translations || {})[language] || quote.text;
      return {
        id: quote.id,
        text,
        actor
      };
    }
    return null;
  }

  async addQuote(title: string, actorName: string, quoteText: string): Promise<FirestoreFilmModel> {
    const [actor] = (await this._actorsRef.where('name', '==', actorName).get()).docs;
    let actorId: string;
    if (!actor) {
      const id = uuid.v4();
      await this._actorsRef.doc(id).set({name: actorName});
      actorId = id;
    }
    else {
      actorId = actor.data().id;
    }
    const quote = {
      id: uuid.v4(),
      text: quoteText,
      actorRef: actorId
    };
    let filmId;
    let filmSnap = (await this._firestore.runTransaction(async transaction => {
      const [film] = (await transaction.get(this._filmsRef.where('title', '==', title))).docs;
      if (film) {
        const quotes = [...film.data().quotes, quote];
        filmId = film.data().id;
        transaction.update(this._filmsRef.doc(filmId), {quotes});
      }
      else {
        filmId = uuid.v4();
        transaction.set(this._filmsRef.doc(filmId), {
          title,
          quotes: [quote]
        });
      }
      return film;
    }));
    let film: FirestoreFilmModel;
    if (!filmSnap) {
      [filmSnap] = (await this._filmsRef.where('title', '==', title).get()).docs;
      film = filmSnap.data();
    }
    else {
      film = filmSnap.data();
      film.quotes.push(quote);
    }

    return film;
  }

}
