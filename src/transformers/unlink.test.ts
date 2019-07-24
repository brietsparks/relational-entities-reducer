import transformUnlinkDefinitions from './unlink';
import Model from '../model';
import { entities, selectors } from '../mocks';
import { OpId, Operation, UnlinkDefinition } from '../interfaces';
import { OP_EDIT } from '../constants';

describe('transformers/unlink', () => {
  describe('transformUnlinkDefinitions', () => {
    it('unlinks state resources', () => {
      const state = {
        comment: {
          resources: {
            'c1': { postId: 'p1' },
            'c2': { postId: 'p2' },
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

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, UnlinkDefinition>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          relation: 'post',
          linkedId: 'p1',
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          relation: 'comment',
          linkedId: 'c2',
        }
      }));

      const actual = transformUnlinkDefinitions(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          data: { postId: null },
          operator: OP_EDIT
        },
        'comment.c2': {
          type: 'comment',
          id: 'c2',
          data: { postId: null },
          operator: OP_EDIT
        },
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: { commentIds: [] },
          operator: OP_EDIT
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          data: { commentIds: [] },
          operator: OP_EDIT
        }
      }));

      expect(actual).toEqual(expected);
    });

    it('omits definitions for nonexistent resources', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const operations = new Map<OpId, UnlinkDefinition>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          relation: 'post',
          linkedId: 'p1',
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          relation: 'comment',
          linkedId: 'c2',
        }
      }));

      const actual = transformUnlinkDefinitions(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({}));

      expect(actual).toEqual(expected);
    });
  });
});
