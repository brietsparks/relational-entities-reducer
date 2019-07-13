import {
  validateResourceType,
  validateResourceId,
  validateResourceData,
  validateResourceOptions,
  validateFk,
  validateIndex,
} from './validation';
import { Model } from '../model';
import { modelSchema, nonStringsOrNumbers, nonObjectOptional, nonObjects, nonIntegers, nonStrings } from '../mocks';

describe('actions/validation', () => {
  test('validateResourceType', () => {
    const model = new Model(modelSchema);

    validateResourceType('comment', model);

    const actual = () => validateResourceType('chicken', model);
    const error = new Error('model does not have an entity of type "chicken"');

    expect(actual).toThrow(error);
  });

  test('validateResourceId', () => {
    validateResourceId('s1');
    validateResourceId(10);

    nonStringsOrNumbers.forEach(invalidId => {
      // @ts-ignore
      const actual = () => validateResourceId(invalidId);
      const error = new Error('resource id must be a string or number');
      expect(actual).toThrow(error);
    })
  });

  test('validateResourceData', () => {
    validateResourceData({});

    nonObjectOptional.forEach(invalidData => {
      // @ts-ignore
      const actual = () => validateResourceData(invalidData);
      const error = new Error('resource data must be an object literal');
      expect(actual).toThrow(error);
    });

    nonObjects.forEach(invalidData => {
      // @ts-ignore
      const actual = () => validateResourceData(invalidData, true);
      const error = new Error('resource data must be an object literal');
      expect(actual).toThrow(error);
    });
  });

  test('validateOptions', () => {
    validateResourceData({});

    nonObjectOptional.forEach(invalidData => {
      // @ts-ignore
      const actual = () => validateResourceOptions(invalidData);
      const error = new Error('resource options must be an object literal');
      expect(actual).toThrow(error);
    });

    nonObjects.forEach(invalidData => {
      // @ts-ignore
      const actual = () => validateResourceOptions(invalidData, true);
      const error = new Error('resource options must be an object literal');
      expect(actual).toThrow(error);
    })
  });

  describe('validateFk', () => {
    const model = new Model(modelSchema);

    test('fk must be a string', () => {
      nonStrings.forEach(invalidFk => {
        // @ts-ignore
        const actual = () => validateFk(model,'post', invalidFk);
        const error = new Error('foreign key must be a string');
        expect(actual).toThrow(error);
      })
    });

    test('fk must exist in model', () => {
      const actual = () => validateFk(model,'post', 'chickenId');
      const error = new Error('resource of type "post" does not contain a foreign key "chickenId"');
      expect(actual).toThrow(error);
    });
  });

  describe('validateIndex', () => {
    test('index must be an integer', () => {
      nonIntegers.forEach(invalidIndex => {
        // @ts-ignore
        const actual = () => validateIndex(invalidIndex);
        const error = new Error('index must be an integer');
        expect(actual).toThrow(error);
      });
    });

    test('index must be greater than 0', () => {
      const actual = () => validateIndex(-1);
      const error = new Error('index must be greater than 0');
      expect(actual).toThrow(error);
    });
  });
});
