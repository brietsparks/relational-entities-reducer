import { createIdsReducer } from './ids';

describe('reducer/ids', () => {
  describe('createIdsReducer', () => {
    const actions = {
      ADD: 'ADD',
      REMOVE: 'REMOVE',
      REINDEX: 'REINDEX'
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
        remove: {
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

    describe('reindexes resourceIds', () => {
      const reducer = createIdsReducer('comment', actions);
      const state = ['c1', 'c2', 'c3','c4', 'c5'];

      test('of its type', () => {
        const action = {
          type: 'REINDEX',
          resourceType: 'comment',
          sourceIndex: 1,
          destinationIndex: 3
        };

        const actual = reducer(state, action);

        const expected = ['c1', 'c3','c4', 'c2', 'c5'];

        expect(actual).toEqual(expected);
      });

      test('not of other types', () => {
        const action = {
          type: 'REINDEX',
          resourceType: 'post',
          sourceIndex: 1,
          destinationIndex: 3
        };

        const actual = reducer(state, action);

        expect(actual).toEqual(state);
      });
    });
  });
});
