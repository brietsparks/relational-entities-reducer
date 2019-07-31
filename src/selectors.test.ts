import { convertCidToObject, makeSelectors } from './selectors';
import { entities } from './mocks';

describe('selectors', () => {
  describe('makeSelectors', () => {
    const selectors = makeSelectors(entities);

    describe('getEntityIds', () => {
      it('returns ids of an entity', () => {
        const state = {
          post: {
            resources: { 'p1': {}, 'p2': {} },
            ids: ['p1', 'p2']
          }
        };

        const actual = selectors.getEntityIds(state, { type: 'post' });

        const expected = ['p1', 'p2'];

        expect(actual).toEqual(expected);
      });
    });

    describe('getEntityResources', () => {
      it('it returns the resources collection', () => {
        const state = {
          post: {
            resources: { 'p1': {}, 'p2': {} },
            ids: ['p1', 'p2']
          }
        };

        const actual = selectors.getEntityResources(state, { type: 'post' });

        const expected = { 'p1': {}, 'p2': {} };

        expect(actual).toEqual(expected);
      });
    });

    describe('getResource', () => {
      it('returns an existing resource', () => {
        const state = {
          post: {
            resources: { 'p1': { body: 'foo' } },
            ids: ['p1']
          }
        };

        let actual;
        const expected = { body: 'foo' };

        actual = selectors.getResource(state, { type: 'post', id: 'p1' });
        expect(actual).toEqual(expected);

        actual = selectors.getResource(state, ['post', 'p1']);
        expect(actual).toEqual(expected);

        actual = selectors.getResource(state, 'post.p1');
        expect(actual).toEqual(expected);
      });
    });

  });

  describe('convertCidToObject', () => {
    const expected = { type: 'post', id: 'p1' };

    it('converts a cid array', () => {
      const actual = convertCidToObject(['post', 'p1']);
      expect(actual).toEqual(expected);
    });

    it('converts a string', () => {
      const actual = convertCidToObject('post.p1');
      expect(actual).toEqual(expected);
    });

    it('returns an object if given an object', () => {
      const actual = convertCidToObject(expected);
      expect(actual).toEqual(expected);
    });

    it('throws if not given a composite id', () => {
      // @ts-ignore
      const actual = () => convertCidToObject(null);
      const error = new Error('invalid composite id');
      expect(actual).toThrow(error);
    });
  });
});
