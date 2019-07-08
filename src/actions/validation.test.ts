import { validateResourceType, validateResourceId, validateResourceData, validateResourceOptions } from './validation';
import { Model } from '../model';
import { modelSchema, nonStringsOrNumbers, nonObjectOptional, nonObjects } from '../mocks';

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
});
