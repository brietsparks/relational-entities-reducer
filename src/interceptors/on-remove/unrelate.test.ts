import unrelate from './unrelate';
import { Model } from '../../model';
import { modelSchema } from '../../mocks';

describe('interceptors/on-remove/unrelate', () => {
  const model = new Model(modelSchema);

  it('returns the in-state resources whose related ids should be edited to reflect resource removals', () => {
    const state = {
      user: {
        resources: {
          'u1': { authoredPostIds: ['p2', 'p3'] }
        },
        ids: ['u1']
      },
      post: {
        resources: {
          'p1': { commentIds: ['c1', 'c2'] },
          'p2': { authorId: 'u1' },
          'p3': { authorId: 'u1' }
        },
        ids: ['p1', 'p2', 'p3']
      },
      comment: {
        resources: {
          'c1': { postId: 'p1' },
          'c2': { postId: 'p1' },
          'c3': {}
        },
        ids: ['c1', 'c2', 'c3']
      }
    };

    const removableResources = {
      'post.p1': { resourceType: 'post', resourceId: 'p1' },
      'post.p2': { resourceType: 'post', resourceId: 'p2' },
    };

    const actual = unrelate(model, state, removableResources);

    const expected = {
      'user.u1': {
        resourceType: 'user',
        resourceId: 'u1',
        data: { authoredPostIds: ['p3'] }
      },
      'comment.c1': {
        resourceType: 'comment',
        resourceId: 'c1',
        data: { postId: null }
      },
      'comment.c2': {
        resourceType: 'comment',
        resourceId: 'c2',
        data: { postId: null }
      },
    };

    expect(actual).toEqual(expected);
  });

  it('does not return related resources that already in the to-be-removed collection', () => {
    const state = {
      post: {
        resources: { 'p1': { commentIds: ['c1'] } },
        ids: ['p1']
      },
      comment: {
        resources: { 'c1': { postId: 'p1' } },
        ids: ['c1']
      }
    };

    const removableResources = {
      'comment.c1': { resourceType: 'comment', resourceId: 'c1' },
      'post.p1': { resourceType: 'post', resourceId: 'p1' }
    };

    const actual = unrelate(model, state, removableResources);

    expect(actual).toEqual({});
  });
});
