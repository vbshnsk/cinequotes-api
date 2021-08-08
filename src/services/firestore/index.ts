import {FirestoreActorModel} from '../../@types/actors';
import IFilms, {FirestoreFilmModel} from '../../@types/films';
import {CollectionReference, DocumentData, Firestore, QueryDocumentSnapshot} from '@google-cloud/firestore';
import IDatastoreConnection from '../../@types/datastoreConnection';
import FirestoreFilms from './films';
import {FirestoreConnectionOptions} from '../../@types/config';
import {FirestoreQuoteModel} from '../../@types/quote';

export default class FirestoreConnection implements IDatastoreConnection {
  private readonly _films: IFilms;
  private readonly _firestore: Firestore;
  private readonly _filmsRef: CollectionReference<FirestoreFilmModel>;
  private readonly _actorsRef: CollectionReference<FirestoreActorModel>;

  constructor(opts: FirestoreConnectionOptions) {
    this._firestore = new Firestore(opts);
    this._filmsRef = this._firestore.collection('films')
      .withConverter({
        fromFirestore: (snapshot: QueryDocumentSnapshot): FirestoreFilmModel => {
          const data = snapshot.data();
          data.id = snapshot.id;
          if (this._isValidFilmModel(data)) {
            return data;
          }
          return null;
        },
        toFirestore(film: FirestoreFilmModel): DocumentData {
          const data = Object.assign({}, film);
          delete data.id;
          return data;
        }
      });
    this._actorsRef = this._firestore.collection('actors')
      .withConverter({
        fromFirestore: snapshot => {
          const data = snapshot.data();
          data.id = snapshot.id;
          if (this._isValidActorModel(data)) {
            return data;
          }
          return null;
        },
        toFirestore: actor => {
          const data = Object.assign({}, actor);
          delete data.id;
          return data;
        }
      });
    this._films = new FirestoreFilms(this._firestore, this._filmsRef, this._actorsRef);
  }

  get films(): IFilms {
    return this._films;
  }

  connect() {
    return Promise.resolve();
  }

  disconnect() {
    return Promise.resolve();
  }

  insertAt(path: string, data: unknown) {
    return this._firestore.collection(path).add(data);
  }

  _isValidFilmModel(v): v is FirestoreFilmModel {
    return typeof v.title === 'string' &&
      typeof v.id === 'string' &&
      this._isValidQuoteModel(v);
  }

  _isValidQuoteModel(v): v is FirestoreQuoteModel {
    return typeof v.text === 'string' &&
      typeof v.actorRef === 'string';
  }

  _isValidActorModel(v): v is FirestoreActorModel {
    return typeof v.id === 'string' &&
      typeof v.name === 'string';
  }
}