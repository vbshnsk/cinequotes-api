import {validate} from 'uuid';

export default class Validator {
  isUUID(value: string) {
    return validate(value);
  }
}