import { createResourcesReducer } from './resources';

describe('reducer/resources', () => {
  describe('createResourcesReducer', () => {
    const actions = {
      ADD: 'ADD',
      REMOVE: 'REMOVE',
      EDIT: 'EDIT',
      REINDEX_RELATED: 'REINDEX_RELATED'
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
        'c2': { childIds: ['c3'] },
        'c3': { parentId: 'c2' },
        'c4': {}
      };

      const action = {
        type: 'REMOVE',
        remove: {
          comment: {
            'c1': {
              resourceType: 'comment',
              resourceId: 'c1'
            },
            'c3': {
              resourceType: 'comment',
              resourceId: 'c3'
            }
          },
          post: {
            'c2': {
              resourceType: 'post',
              resourceId: 'c2'
            },
            'c4': {
              resourceType: 'post',
              resourceId: 'c4'
            }
          }
        },
        edit: {
          comment: {
            'c2': {
              resourceType: 'comment',
              resourceId: 'c2',
              data: { childIds: [] }
            }
          }
        }
      };

      const actual = reducer(state, action);

      const expected = {
        'c2': { childIds: [] },
        'c4': {}
      };

      expect(actual).toEqual(expected);
    });

    it('edits resources of its type', () => {
      const reducer = createResourcesReducer('comment', actions);

      const state = {
        'c1': { text: 'foo', meta: 'this is' },
        'c2': {}
      };

      const action = {
        type: 'EDIT',
        resources: {
          comment: {
            'c1': {
              resourceType: 'comment',
              resourceId: 'c1',
              data: { text: 'foog' },
              options: {}
            },
            'c2': {
              resourceType: 'comment',
              resourceId: 'c2',
              data: { text: 'barg' },
              options: {}
            }
          },
          post: {
            'c1': {
              resourceType: 'post',
              resourceId: 'c1',
              data: { text: 'baz' },
              options: {}
            }
          }
        }
      };

      const actual = reducer(state, action);

      const expected = {
        'c1': { text: 'foog', meta: 'this is' },
        'c2': { text: 'barg' }
      };

      expect(actual).toEqual(expected);
    });

    it('reindexes related ids of resources of its type', () => {
      const reducer = createResourcesReducer('post', actions);

      const state = {
        'p1': { commentIds: ['c1', 'c2', 'c3', 'c4', 'c5'] },
        'p2': {}
      };

      const action = {
        type: 'REINDEX_RELATED',
        resourceType: 'post',
        resourceId: 'p1',
        fk: 'commentIds',
        sourceIndex: 1,
        destinationIndex: 3
      };

      const actual = reducer(state, action);

      const expected = {
        'p1': { commentIds: ['c1', 'c3', 'c4', 'c2', 'c5'] },
        'p2': {}
      };

      expect(actual).toEqual(expected);
    });
  });
});
