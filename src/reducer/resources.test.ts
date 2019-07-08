import { createResourcesReducer } from './resources';

describe('reducer/resources', () => {
  describe('createResourcesReducer', () => {
    const actions = {
      ADD: 'ADD',
      REMOVE: 'REMOVE'
    };

    it('returns an empty object by default', () => {
      const reducer = createResourcesReducer('comment', actions);

      const actual = reducer(undefined, { type: '' });

      expect(actual).toEqual({});
    });

    it('adds resources of its type', () => {
      const reducer = createResourcesReducer('comment', actions);

      const state = {
        'c1': {},
        'c2': {}
      };

      const action = {
        type: 'ADD',
        resources: {
          comment: {
            'c1': {
              resourceType: 'comment',
              resourceId: 'c1',
              data: { parentId: 'c2' },
              options: {}
            },
            'c2': {
              resourceType: 'comment',
              resourceId: 'c2',
              data: { childIds: ['c1'] },
              options: { ignoreIdIndex: true }
            },
            'c3': {
              resourceType: 'comment',
              resourceId: 'c3',
              data: { text: 'foo' },
              options: {}
            },
          },
          post: {
            'p1': {
              resourceType: 'post',
              resourceId: 'p1',
              data: {},
              options: {}
            },
          }
        }
      };

      const actual = reducer(state, action);

      const expected = {
        'c1': { parentId: 'c2' },
        'c2': { childIds: ['c1'] },
        'c3': { text: 'foo' }
      };

      expect(actual).toEqual(expected);
    });

    it('removes resources of its type', () => {
      const reducer = createResourcesReducer('comment', actions);

      const state = {
        'c1': {},
        'c2': {},
        'c3': {},
        'c4': {}
      };

      const action = {
        type: 'REMOVE',
        remove: {
          comment: {
            'c1': { resourceType: 'comment', resourceId: 'c1' },
            'c3': { resourceType: 'comment', resourceId: 'c3' }
          },
          post: {
            'c2': { resourceType: 'post', resourceId: 'c2' },
            'c4': { resourceType: 'post', resourceId: 'c4' }
          }
        }
      };

      const actual = reducer(state, action);

      const expected = {
        'c2': {},
        'c4': {}
      };

      expect(actual).toEqual(expected);
    });
  });
});
