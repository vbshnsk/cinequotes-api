import IFilms from './films';
import IActors from './actors';

export default interface IDatastoreConnection {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  readonly films: IFilms
  readonly actors: IActors
}
