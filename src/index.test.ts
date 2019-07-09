import makeActionsAndReducer from '.';
import { modelSchema } from './mocks';
import { RelationRemovalSchema } from './interfaces';

describe('index', () => {
  const { reducer, actions } = makeActionsAndReducer(modelSchema);

  test('add resources', () => {
    const state = {
      'comment': {
        resources: { 'c1': {}, 'c2': {} },
        ids: ['c1', 'c2']
      },
      'post': {
        resources: { 'p0': {} },
        ids: ['p0']
      }
    };

    const action = actions.add(
      ['comment', 'c2', {}],
      ['comment', 'c3', { postId: 'p0' }],
      ['comment', 'c4', {}],
      ['comment', 'c6', { postId: 'p2' }],
      ['comment', 'c7', { parentId: 'c6' }],
      ['comment', 'c8', { parentId: 'c6' }],
      ['post', 'p1', { commentIds: ['c4', 'c5'] }],
    );

    const actual = reducer(state, action);

    const actualChanged = {
      comment: actual.comment,
      post: actual.post
    };

    const expectedChanged = {
      comment: {
        resources: {
          'c1': {},
          'c2': {},
          'c3': { postId: 'p0' },
          'c4': { postId: 'p1' },
          'c5': { postId: 'p1' },
          'c6': { postId: 'p2', childIds: ['c7', 'c8'] },
          'c7': { parentId: 'c6' },
          'c8': { parentId: 'c6' },
        },
        ids: ['c1', 'c2', 'c3', 'c4', 'c6', 'c7', 'c8', 'c5']
      },
      post: {
        resources: {
          'p0': { commentIds: ['c3'] },
          'p1': { commentIds: ['c4', 'c5'] },
          'p2': { commentIds: ['c6'] }
        },
        ids: ['p0', 'p1', 'p2']
      }
    };

    expect(actualChanged).toEqual(expectedChanged);
  });

  test('remove resources', () => {
    const state = {
      user: {
        resources: {
          'u1': { authoredPostIds: ['p1'], commentIds: ['c2'] },
          'u2': { editablePostIds: ['p2'] },
          'u3': {}
        },
        ids: ['u1', 'u2', 'u3']
      },
      post: {
        resources: {
          'p1': { authorId: 'u1', commentIds: ['c1'] },
          'p2': { editorIds: ['u2'] }
        },
        ids: ['p1', 'p2']
      },
      comment: {
        resources: {
          'c1': { postId: 'p1' },
          'c2': { userId: 'u1' }
        },
        ids: ['c1', 'c2']
      }
    };

    const userRemovalSchema: RelationRemovalSchema = {
      commentIds: {},
      authoredPostIds: {
        commentIds: {}
      },
      thisInvalidFkGetsSkipped: {}
    };

    const action = actions.remove(
      ['user', 'u1', { removeRelated: userRemovalSchema }],
      { resourceType: 'user', resourceId: 'u2' }
    );

    const actual = reducer(state, action);

    const expected = {
      user: {
        resources: { 'u3': {} },
        ids: ['u3']
      },
      post: {
        resources: {
          'p2': { editorIds: [] }
        },
        ids: ['p2']
      },
      comment: {
        resources: {},
        ids: []
      },
      permission: {
        resources: {},
        ids: []
      }
    };

    expect(actual).toEqual(expected);
  });

  test('edit resources', () => {
    const state = {
      comment: {
        resources: {
          'c1': { text: 'foo', meta: 'this is' },
          'c2': {},
          'c3': {}
        },
        ids: ['c1', 'c2', 'c3']
      },
      post: {
        resources: {
          'p1': {},
        },
        ids: ['p1']
      }
    };

    const action = actions.edit(
      ['comment', 'c1', { text: 'foob' }],
      { resourceType: 'comment', resourceId: 'c2', data: { text: 'barg' } },
      ['post', 'p1', { text: 'baz' }]
    );

    const actual = reducer(state, action);

    const actualChange = {
      comment: actual.comment,
      post: actual.post
    };

    const expectedChange = {
      comment: {
        resources: {
          'c1': { text: 'foob', meta: 'this is' },
          'c2': { text: 'barg' },
          'c3': {}
        },
        ids: ['c1', 'c2', 'c3']
      },
      post: {
        resources: {
          'p1': { text: 'baz' },
        },
        ids: ['p1']
      }
    };

    expect(actualChange).toEqual(expectedChange);
  });

  test('reindex resource', () => {
    const state = {
      post: {
        resources: { 'p1': {}, 'p2': {}, 'p3': {} },
        ids: ['p1', 'p2', 'p3']
      },
      comment: {
        resources: { 'c1': {}, 'c2': {}, 'c3': {}, 'c4': {}, 'c5': {} },
        ids: ['c1', 'c3','c4', 'c2', 'c5']
      }
    };

    const action = actions.reindex('comment', 1, 3);

    const actual = reducer(state, action);

    const actualChange = {
      post: actual.post,
      comment: actual.comment
    };

    const expectedChange = {
      post: {
        resources: { 'p1': {}, 'p2': {}, 'p3': {} },
        ids: ['p1', 'p2', 'p3']
      },
      comment: {
        resources: { 'c1': {}, 'c2': {}, 'c3': {}, 'c4': {}, 'c5': {} },
        ids: ['c1','c4', 'c2', 'c3', 'c5']
      }
    };

    expect(actualChange).toEqual(expectedChange);
  });
});
