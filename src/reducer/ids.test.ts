import { createIdsReducer } from './ids';

describe('reducer/ids', () => {
  describe('createIdsReducer', () => {
    const actions = {
      ADD: 'ADD'
    };

    it('returns an empty array by default', () => {
      const reducer = createIdsReducer('comment', actions);

      const actual = reducer(undefined, { type: '' });

      expect(actual).toEqual([]);
    });

    it('adds resourceIds if its type', () => {
      const reducer = createIdsReducer('comment', actions);

      const state = ['c2'];

      const action = {
        type: 'ADD',
        ids: {
          comment: ['c1', 'c3'],
          post: ['p1']
        }
      };

      const actual = reducer(state, action);

      const expected = ['c2', 'c1', 'c3'];

      expect(actual).toEqual(expected);
    });
  });
});
