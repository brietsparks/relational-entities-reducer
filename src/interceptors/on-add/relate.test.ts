import relate from './relate';
import { Model } from '../../model';
import { modelSchema } from '../../mocks';

describe('interceptors/on-add/relate', () => {
  it('makes relations among new resources and existing resources in state', () => {
    const model = new Model(modelSchema);

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
        }
      }))
    };

    const actual = relate(model, state, action);

    const expected = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c0': {
          resourceType: 'comment',
          resourceId: 'c0',
          data: { postId: 'p1', childIds: new Set(['c1']) },
          options: {},
        },
        'post.p1': {
          resourceType: 'post',
          resourceId: 'p1',
          data: { commentIds: new Set(['c0']) },
          options: { ignoreIdIndex: true },
        },
        'comment.c1': {
          resourceType: 'comment',
          resourceId: 'c1',
          data: { parentId: 'c0' },
          options: { ignoreIdIndex: true },
        }
      }))
    };

    expect(actual).toEqual(expected);
  });

  it('makes relations among new resources!', () => {
    const model = new Model(modelSchema);

    const state = {
      'comment': { resources: {}, ids: [] },
      'post': { resources: {}, ids: [] }
    };

    const action = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c1': {
          resourceType: 'comment',
          resourceId: 'c1',
          data: { postId: 'p1', childIds: new Set(['c2', 'c4']) },
          options: {},
        },
        'comment.c4': {
          resourceType: 'comment',
          resourceId: 'c4',
          data: {},
          options: {},
        },
        'comment.c5': {
          resourceType: 'comment',
          resourceId: 'c5',
          data: { parentId: 'c4' },
          options: {},
        },
        'post.p1': {
          resourceType: 'post',
          resourceId: 'p1',
          data: { commentIds: new Set(['c3']) },
          options: {},
        }
      }))
    };

    const actual = relate(model, state, action);

    const expected = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c1': {
          resourceType: 'comment',
          resourceId: 'c1',
          data: { postId: 'p1', childIds: new Set(['c2', 'c4']) },
          options: {},
        },
        'comment.c4': {
          resourceType: 'comment',
          resourceId: 'c4',
          data: { parentId: 'c1', childIds: new Set(['c5']) },
          options: {},
        },
        'comment.c5': {
          resourceType: 'comment',
          resourceId: 'c5',
          data: { parentId: 'c4' },
          options: {},
        },
        'post.p1': {
          resourceType: 'post',
          resourceId: 'p1',
          data: { commentIds: new Set(['c3', 'c1']) },
          options: {},
        },
        'comment.c2': {
          resourceType: 'comment',
          resourceId: 'c2',
          data: { parentId: 'c1' },
          options: {},
        },
        'comment.c3': {
          resourceType: 'comment',
          resourceId: 'c3',
          data: { postId: 'p1' },
          options: {},
        },
      }))
    };

    expect(actual).toEqual(expected);
  });
});
