import { onAdd, onRemove } from './interceptor';

import { modelSchema } from './mocks';
import { Model } from './model';
import { RelationRemovalSchema } from './interfaces';


describe('interceptor', () => {
  const model = new Model(modelSchema);

  test('onAdd', () => {
    const state = {
      'comment': {
        resources: { 'c1': {} },
        ids: ['c1']
      },
      'post': {
        resources: { 'p1': {} },
        ids: ['p1']
      }
    };

    const action = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c0': {
          resourceType: 'comment',
          resourceId: 'c0',
          data: { postId: 'p1', childIds: new Set(['c1']) },
          options: {}
        },
        'comment.c10': {
          resourceType: 'comment',
          resourceId: 'c10',
          data: { postId: 'p10' },
          options: {}
        },
        'post.p10': {
          resourceType: 'post',
          resourceId: 'p10',
          data: {},
          options: {}
        },
      }))
    };

    const actual = onAdd(model, state, action);

    const expected = {
      type: 'whatever',
      resources: {
        comment: {
          'c0': {
            resourceType: 'comment',
            resourceId: 'c0',
            data: { postId: 'p1', childIds: ['c1'] },
            options: {},
          },
          'c10': {
            resourceType: 'comment',
            resourceId: 'c10',
            data: { postId: 'p10' },
            options: {},
          },
          'c1': {
            resourceType: 'comment',
            resourceId: 'c1',
            data: { parentId: 'c0' },
            options: { ignoreIdIndex: true },
          }
        },
        post: {
          'p10': {
            resourceType: 'post',
            resourceId: 'p10',
            data: { commentIds: ['c10'] },
            options: {}
          },
          'p1': {
            resourceType: 'post',
            resourceId: 'p1',
            data: { commentIds: ['c0'] },
            options: { ignoreIdIndex: true },
          }
        }
      },
      ids: {
        comment: ['c0', 'c10'],
        post: ['p10']
      }
    };

    expect(actual).toEqual(expected);
  });

  test('onRemove', () => {
    const state = {
      user: {
        resources: {
          'u1': { authoredPostIds: ['p1'], commentIds: ['c2'] },
          'u2': {}
        },
        ids: ['u1', 'u2']
      },
      post: {
        resources: {
          'p1': { authorId: 'u1', commentIds: ['c1'] },
        },
        ids: ['p1']
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

    const action = {
      type: 'whatever',
      remove: {
        'user.u1': {
          resourceType: 'user',
          resourceId: 'u1',
          options: { removeRelated: userRemovalSchema }
        },
        'user.u2': {
          resourceType: 'user',
          resourceId: 'u2',
          options: {}
        }
      }
    };

    const actual = onRemove(model, state, action);

    const expected = {
      type: 'whatever',
      remove: {
        user: {
          'u1': {
            resourceType: 'user',
            resourceId: 'u1',
            options: { removeRelated: userRemovalSchema }
          },
          'u2': {
            resourceType: 'user',
            resourceId: 'u2',
            options: {}
          },
        },
        post: {
          'p1': {
            resourceType: 'post',
            resourceId: 'p1',
            options: {}
          },
        },
        comment: {
          'c1': {
            resourceType: 'comment',
            resourceId: 'c1',
            options: {},
          },
          'c2': {
            resourceType: 'comment',
            resourceId: 'c2',
            options: {},
          }
        }
      }
    };

    expect(actual).toEqual(expected);
  });
});
