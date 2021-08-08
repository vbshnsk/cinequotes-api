export type Actor = {
  id?: string
  name: string
};

export type FirestoreActorModel = {
  id?: string
  name: string
};

export default interface IActors {
  getById: (id: string) => Promise<Actor>
}
