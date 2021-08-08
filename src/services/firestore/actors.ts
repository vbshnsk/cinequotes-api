import IActors, {Actor} from '../../@types/actors';
import {Firestore} from '@google-cloud/firestore';

export default class FirestoreActors implements IActors {
  private _firestore: Firestore;

  constructor(firestore: Firestore) {
    this._firestore = firestore;
  }

  async getById(id: string): Promise<Actor> {
    return undefined;
  }

}