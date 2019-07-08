import { createIdsReducer } from './ids';

describe('reducer/ids', () => {
  describe('createIdsReducer', () => {
    const actions = {
      ADD: 'ADD',
      REMOVE: 'REMOVE'
    };

    it('returns an empty array by default', () => {
      const reducer = createIdsReducer('comment', actions);

      const actual = reducer(undefined, { type: '' });

      expect(actual).toEqual([]);
    });

    it('adds resourceIds of its type', () => {
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

    it('removes resourceIds of its type', () => {
      const reducer = createIdsReducer('comment', actions);

      const state = ['c1', 'c2', 'c3','c4'];

      const action = {
        type: 'REMOVE',
        resources: {
          comment: {
            'c1': { resourceType: 'comment', resourceId: 'c1', options: {} },
            'c3': { resourceType: 'comment', resourceId: 'c3', options: {} }
          },
          post: {
            'c2': { resourceType: 'post', resourceId: 'c2', options: {} },
            'c4': { resourceType: 'post', resourceId: 'c4', options: {} }
          }
        }
      };

      const actual = reducer(state, action);

      const expected = ['c2', 'c4'];

      expect(actual).toEqual(expected);
    });
  });
});
