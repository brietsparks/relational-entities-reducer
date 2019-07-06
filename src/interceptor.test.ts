import { onAdd } from './interceptor';
import { modelSchema } from './mocks';
import { Model } from './model';


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
});
