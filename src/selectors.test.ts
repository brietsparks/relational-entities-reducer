import { convertCidToObject, makeSelectors } from './selectors';

describe('selectors', () => {
  describe('makeSelectors', () => {
    const selectors = makeSelectors();

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
  });
});
