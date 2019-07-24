import transformLinkDefinitions from './link';
import Model from '../model';
import { entities, selectors } from '../mocks';
import { OpId, LinkDefinition, Operation } from '../interfaces';
import { OP_EDIT } from '../constants';

describe('transformers/link', () => {
  describe('transformLinkDefinitions', () => {
    it('links state resources', () => {
      const state = {
        comment: {
          resources: {
            'c1': {},
            'c2': {},
            'c3': { postId: 'p2' }
            },
          ids: ['c1', 'c2']
        },
        post: {
          resources: {
            'p1': {},
            'p2': { commentIds: ['c3'] }
          },
          ids: ['p1', 'p2']
        }
      };

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, LinkDefinition>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          relation: 'post',
          linkedId: 'p1',
          indices: []
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          relation: 'comment',
          linkedId: 'c2',
          indices: []
        }
      }));

      const actual = transformLinkDefinitions(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: { commentIds: ['c1'] },
          operator: OP_EDIT
        },
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          data: { postId: 'p1' },
          operator: OP_EDIT
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          data: { commentIds: ['c3', 'c2'] },
          operator: OP_EDIT
        },
        'comment.c2': {
          type: 'comment',
          id: 'c2',
          data: { postId: 'p2' },
          operator: OP_EDIT
        }
      }));

      expect(actual).toEqual(expected);
    });

    it('omits definitions for nonexistent resources', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const operations = new Map<OpId, LinkDefinition>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          relation: 'post',
          linkedId: 'p1',
          indices: []
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          relation: 'comment',
          linkedId: 'c2',
          indices: []
        }
      }));

      const actual = transformLinkDefinitions(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({}));

      expect(actual).toEqual(expected);
    });
  });
});
