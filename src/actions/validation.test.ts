import {
  validateResourceType, validateResourceId, validateResourceData,
  validateResourceOptions, validateRelation, validateIndex,
} from './validation';
import { nonStringsOrNumbers, nonObjectOptional, nonObjects, nonIntegers, nonStrings, entities } from '../mocks';

describe('actions/validation', () => {
  test('validateResourceType', () => {
    validateResourceType('comment', entities);

    const actual = () => validateResourceType('chicken', entities);
    const error = new Error('entity of type "chicken" does not exist');

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

  describe('validateRelation', () => {
    test('relation must be a string', () => {
      nonStrings.forEach(invalidRelation => {
        // @ts-ignore
        const actual = () => validateRelation(entities,'post', invalidRelation);
        const error = new Error('relation key must be a string');
        expect(actual).toThrow(error);
      })
    });

    test('relation must exist in entities', () => {
      const actual = () => validateRelation(entities,'post', 'chickenId');
      const error = new Error('entity "post" does not contain a relation with the name or key "chickenId"');
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

    // test('index must be greater than 0', () => {
    //   const actual = () => validateIndex(-1);
    //   const error = new Error('index must be greater than 0');
    //   expect(actual).toThrow(error);
    // });
  });
});
