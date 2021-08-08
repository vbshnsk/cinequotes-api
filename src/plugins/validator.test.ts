import Validator from './validator';
import * as uuid from 'uuid';

describe('Validator', () => {

  const validator = new Validator();

  it('should validate uuid', () => {
    expect(validator.isUUID('1321')).toBe(false);
    expect(validator.isUUID(uuid.v4())).toBe(true);
  });

});