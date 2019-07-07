import { Model } from '../../model';
import { modelSchema } from '../../mocks';
import { getRelatedResourcesToRemove } from './unrelate';
import { RelationRemovalSchema } from '../../interfaces';

describe('interceptors/on-remove/unrelated', () => {
  const model = new Model(modelSchema);

  describe('getRelatedResourcesToRemove', () => {
    it('returns related resources to remove', () => {
      const state = {
        user: {
          resources: {
            'u1': {
              authoredPostIds: ['p1', 'p2'],
              editablePostIds: ['p3'],
              commentIds: ['c1', 'c2']
            },
            'u200': {}
          },
          ids: ['u1', 'u200']
        },
        post: {
          resources: {
            'p1': { commentIds: ['c3', 'c4'] },
            'p2': {},
            'p300': { commentIds: ['c1', 'c2'] }
          },
          ids: ['p1', 'p2', 'p300']
        },
        comment: {
          resources: {
            'c1': { postId: 'p300' },
            'c2': { postId: 'p300' },
            'c3': { postId: 'c3' },
            'c4': { postId: 'c4' },
            'c500': {}
          },
          ids: ['c1', 'c2', 'c3', 'c4', 'c500']
        }
      };

      const userRemovalSchema: RelationRemovalSchema = {
        commentIds: {},
        authoredPostIds: {
          commentIds: {}
        }
      };

      const actual = getRelatedResourcesToRemove('user', 'u1', userRemovalSchema, model, state);

      const expected = {
        'comment.c1': { resourceType: 'comment', resourceId: 'c1', options: {} },
        'comment.c2': { resourceType: 'comment', resourceId: 'c2', options: {} },
        'post.p1': { resourceType: 'post', resourceId: 'p1', options: {} },
        'comment.c3': { resourceType: 'comment', resourceId: 'c3', options: {} },
        'comment.c4': { resourceType: 'comment', resourceId: 'c4', options: {} },
        'post.p2': { resourceType: 'post', resourceId: 'p2', options: {} }
      };

      expect(actual).toEqual(expected);
    });


    it('returns related resources to remove recursively', () => {
      const state = {
        user: {
          resources: { 'u1': { commentIds: ['c1'] } },
          ids: ['u1']
        },
        comment: {
          resources: {
            'c1': { childIds: ['c1.1', 'c1.2'] },
            'c1.1': { parentId: 'c1', childIds: ['c1.1.1', 'c1.1.2'] },
            'c1.2': { parentId: 'c1', childIds: ['c1.2.1', 'c1.2.2'] },
            'c1.1.1': { parentId: 'c1.1' },
            'c1.1.2': { parentId: 'c1.1' },
            'c1.2.1': { parentId: 'c1.2' },
            'c1.2.2': { parentId: 'c1.2' },
            'c200': { childIds: ['c200.1'] },
            'c200.1': { parentId: 'c200' }
          },
          ids: ['c1', 'c1.1', 'c1.2', 'c1.1.1', 'c1.1.2', 'c1.2.1', 'c1.2.2', 'c200', 'c200.1']
        }
      };

      const commentRemovalSchema = () => ({ childIds: commentRemovalSchema });
      const userRemovalSchema = ({ commentIds: commentRemovalSchema });

      const actual = getRelatedResourcesToRemove('user', 'u1', userRemovalSchema, model, state);

      const expected = {
        'comment.c1': { resourceType: 'comment', resourceId: 'c1', options: {} },
        'comment.c1.1': { resourceType: 'comment', resourceId: 'c1.1', options: {} },
        'comment.c1.2': { resourceType: 'comment', resourceId: 'c1.2', options: {} },
        'comment.c1.1.1': { resourceType: 'comment', resourceId: 'c1.1.1', options: {} },
        'comment.c1.1.2': { resourceType: 'comment', resourceId: 'c1.1.2', options: {} },
        'comment.c1.2.1': { resourceType: 'comment', resourceId: 'c1.2.1', options: {} },
        'comment.c1.2.2': { resourceType: 'comment', resourceId: 'c1.2.2', options: {} },
      };

      expect(actual).toEqual(expected);
    });
  });
});
