import {Actor} from './actors';

export type FirestoreQuoteModel = {
  id?: string
  text: string
  actorRef: string
  translations?: Record<string, string>
};

type Quote = {
  id?: string
  text: string
  actor: Actor
};

export default Quote;