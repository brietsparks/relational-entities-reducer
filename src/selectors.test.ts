import { nonObjects, nonArrays } from './mocks';

import {
  InvalidState,
  getCollection,
  getCollectionResources,
  getCollectionIds,
  getResource,
  getDoesResourceExist
} from './selectors';

describe('selectors', () => {
  describe('getCollection', () => {
    it('throws if collection is not an object', () => {
      nonObjects.forEach(nonObject => {
        const state = { 'comment': nonObject };

        // @ts-ignore
        const actual = () => getCollection(state, 'comment');

        const error = new InvalidState('collection of "comment" must be a(n) object literal');

        expect(actual).toThrow(error);
      });
    });

    it('returns a valid collection', () => {
      const state = {
        'comment': { resources: {}, ids: [] },
        'post': { resources: {}, ids: [] }
      };

      const actual = getCollection(state, 'comment');
      const expected = { resources: {}, ids: [] };
      expect(actual).toEqual(expected);
    });
  });

  describe('getCollectionResources', () => {
    it('throws if resources is not an object', () => {
      nonObjects.forEach(nonObject => {
        const state = {
          'comment': {
            resources: nonObject,
            ids: []
          }
        };

        // @ts-ignore
        const actual = () => getCollectionResources(state, 'comment');
        const error = new InvalidState('resources of "comment" collection must be a(n) object literal')

        expect(actual).toThrow(error);
      });
    });

    it('returns a valid resources object', () => {
      const state = {
        'comment': {
          resources: { 'c1': {} },
          ids: ['c1']
        }
      };

      const actual = getCollectionResources(state, 'comment');
      const expected = { 'c1': {} };

      expect(actual).toEqual(expected);
    });
  });

  describe('getCollectionIds', () => {
    it('throws if ids is not an array', () => {
      nonArrays.forEach(nonArray => {
        const state = {
          'comment': {
            resources: {},
            ids: nonArray
          }
        };

        // @ts-ignore
        const actual = () => getCollectionIds(state, 'comment');
        const error = new InvalidState('ids of "comment" collection must be a(n) array');

        expect(actual).toThrow(error);
      });
    });

    it('returns a valid ids array', () => {
      const state = {
        'comment': {
          resources: { 'c1': {} },
          ids: ['c1']
        }
      };

      const actual = getCollectionIds(state, 'comment');
      const expected = ['c1'];

      expect(actual).toEqual(expected);
    });
  });

  test('getResource', () => {
    const state = {
      'comment': {
        resources: { 'c1': { text: 'foo' } },
        ids: ['c1']
      }
    };

    let actual;

    actual = getResource(state, ['comment', 'c1']);
    expect(actual).toEqual({ text: 'foo' });

    actual = getResource(state, ['comment', 'c9000']);
    expect(actual).toEqual(undefined);
  });

  test('getDoesResourceExist', () => {
    const state = {
      'comment': {
        resources: { 'c1': { text: 'foo' } },
        ids: ['c1']
      }
    };

    let actual;

    actual = getDoesResourceExist(state, ['comment', 'c1']);
    expect(actual).toEqual(true);

    actual = getDoesResourceExist(state, ['comment', 'c9000']);
    expect(actual).toEqual(false);
  });
});
