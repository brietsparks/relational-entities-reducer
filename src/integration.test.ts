import makeRelationalEntities from '.';

import { schema } from './mocks';

describe('integration', () => {
  test('valid args', () => {
    makeRelationalEntities(schema);
  });

  const { reducer, emptyState, actionCreators, selectors} = makeRelationalEntities(schema);

  describe('basic usage', () => {
    test('add resources', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: { 'c1': {} },
          ids: ['c1']
        },
      };

      const actual = reducer(
        state,
        actionCreators.add(
          ['comment', 'c1', { text: 'foo' }],
          ['comment', 'c2', { text: 'bar' }],
          { type: 'post', id: 'p1' }
        )
      );

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c1': {},
            'c2': { text: 'bar' },
          },
          ids: ['c1', 'c2']
        },
        post: {
          resources: {
            'p1': {}
          },
          ids: ['p1']
        }
      };

      expect(actual).toEqual(expected);
    });

    test('edit resources', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { text: 'foo' },
            'c2': {}
          },
          ids: ['c1', 'c2']
        }
      };

      const actual = reducer(state, actionCreators.edit(
        ['comment', 'c1', { text: 'foob', meta: 'bar' }],
        { type: 'comment', id: 'c2', data: { text: 'baz' } },
        ['comment', 'c3000', { text: 'this resource does not exist' }]
      ));

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { text: 'foob', meta: 'bar' },
            'c2': { text: 'baz' }
          },
          ids: ['c1', 'c2']
        }
      };

      expect(actual).toEqual(expected);
    });

    test('remove resources', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { text: 'foo' },
            'c2': {},
            'c3': {}
          },
          ids: ['c1', 'c2', 'c3']
        },
        post: {
          resources: { 'p1': {} },
          ids: ['p1']
        }
      };

      const actual = reducer(state, actionCreators.remove(
        ['comment', 'c2'],
        { type: 'post', id: 'p1' }
      ));

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { text: 'foo' },
            'c3': {}
          },
          ids: ['c1', 'c3']
        },
        post: {
          resources: {},
          ids: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('link resources', () => {
      const state = {
        comment: {
          resources: { 'c1': {}, 'c2': {} },
          ids: ['c1', 'c2']
        },
        post: {
          resources: { 'p1': {}, 'p2': {} },
          ids: ['p1', 'p2']
        }
      };

      const actual = reducer(state, actionCreators.link(
        { type: 'comment', id: 'c1', relation: 'post', linkedId: 'p1', indices: [] },
        ['post', 'p2', 'comment', 'c2', []],
        ['post', 'p10000', 'comment', 'c10000', []]
      ));

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { postId: 'p1' },
            'c2': { postId: 'p2' }
          },
          ids: ['c1', 'c2']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1'] },
            'p2': { commentIds: ['c2'] }
          },
          ids: ['p1', 'p2']
        }
      };

      expect(actual).toEqual(expected);
    });

    test('unlink resources', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { postId: 'p1' },
            'c2': { postId: 'p2' }
          },
          ids: ['c1', 'c2']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1'] },
            'p2': { commentIds: ['c2'] }
          },
          ids: ['p1', 'p2']
        }
      };

      const actual = reducer(state, actionCreators.unlink(
        { type: 'comment', id: 'c1', relation: 'post', linkedId: 'p1' },
        ['post', 'p2', 'comment', 'c2'],
        ['post', 'p10000', 'comment', 'c10000']
      ));

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { postId: null },
            'c2': { postId: null }
          },
          ids: ['c1', 'c2']
        },
        post: {
          resources: {
            'p1': { commentIds: [] },
            'p2': { commentIds: [] }
          },
          ids: ['p1', 'p2']
        }
      };

      expect(actual).toEqual(expected);
    });

    test('reindex resource', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: { 'c1': {}, 'c2': {}, 'c3': {}, 'c4': {}, 'c5': {} },
          ids: ['c1', 'c2', 'c3', 'c4', 'c5']
        }
      };

      const actual = reducer(state, actionCreators.reindex('comment', 3, 1));

      const expected = {
        ...emptyState,
        comment: {
          resources: { 'c1': {}, 'c2': {}, 'c3': {}, 'c4': {}, 'c5': {} },
          ids: ['c1', 'c4', 'c2', 'c3', 'c5']
        }
      };

      expect(actual).toEqual(expected);
    });

    test('reindex related resource', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: { 'c1': {}, 'c2': {}, 'c3': {}, 'c4': {}, 'c5': {} },
          ids: ['c1', 'c4', 'c2', 'c3', 'c5']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1', 'c4', 'c2', 'c3', 'c5'] }
          },
          ids: ['p1']
        }
      };

      const actual = reducer(state, actionCreators.reindexRelated('post', 'p1', 'commentIds', 3, 1));

      const expected = {
        ...emptyState,
        comment: {
          resources: { 'c1': {}, 'c2': {}, 'c3': {}, 'c4': {}, 'c5': {} },
          ids: ['c1', 'c4', 'c2', 'c3', 'c5']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1', 'c3', 'c4', 'c2', 'c5'] }
          },
          ids: ['p1']
        }
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('writes with relations', () => {
    test('add resources with links', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { postId: 'p1' },
            'c2': { postId: 'p1' },
            'c3': { postId: 'p1' },
          },
          ids: ['c1', 'c2', 'c3']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1', 'c2', 'c3'] },
          },
          ids: ['p1']
        }
      };

      const actual = reducer(
        state,
        actionCreators.add(
          [
            'comment', 'c4',
            { text: 'foo', postId: 'p1' },
            { indicesByRelation: { post: 1 } }
          ],
          {
            type: 'post',
            id: 'p2',
            data: { title: '', commentIds: ['c5', 'c3'] }
          }
        )
      );

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { postId: 'p1' },
            'c2': { postId: 'p1' },
            'c3': { postId: 'p2' },
            'c4': { postId: 'p1', text: 'foo' },
            'c5': { postId: 'p2' }
          },
          ids: ['c1', 'c2', 'c3', 'c4', 'c5']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1', 'c4', 'c2'] },
            'p2': { commentIds: ['c5', 'c3'], title: '' }
          },
          ids: ['p1', 'p2']
        }
      };

      expect(actual).toEqual(expected);
    });

    test('remove resources and detach their links', () => {
      const state = {
        ...emptyState,
        comment: {
          resources: {
            'c1': { postId: 'p1' },
            'c2': { postId: 'p1' },
            'c3': { postId: 'p2' }
          },
          ids: ['c1', 'c2', 'c3']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c1', 'c2'] },
            'p2': { commentIds: ['c3'] }
          },
          ids: ['p1', 'p2']
        }
      };

      const actual = reducer(state, actionCreators.remove(
        { type: 'comment', id: 'c1' },
        ['post', 'p2']
      ));

      const expected = {
        ...emptyState,
        comment: {
          resources: {
            'c2': { postId: 'p1' },
            'c3': { postId: null }
          },
          ids: ['c2', 'c3']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c2'] },
          },
          ids: ['p1']
        }
      };

      expect(actual).toEqual(expected);
    });
  });

});
