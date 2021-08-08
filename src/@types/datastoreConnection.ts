import IFilms from './films';

export default interface IDatastoreConnection {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  readonly films: IFilms
}
