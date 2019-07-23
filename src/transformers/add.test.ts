import transformAddOperations, { toIndicesByRelationKey } from './add';
import { AddOperation, AddOptions, Operation, OpId } from '../interfaces';
import { OP_ADD, OP_EDIT } from '../constants';

import Model from '../model';
import { entities, selectors } from '../mocks';

describe('transformers/add', () => {
  describe('transformAddOperations', () => {
    it('links payload operations', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const operations = new Map<OpId, AddOperation>(Object.entries({
        'post.p1': {
          type: 'post', id: 'p1', options: {},
          data: { commentIds: ['c1', 'c2'] }, operator: OP_ADD
        },
        'comment.c1': {
          type: 'comment', id: 'c1', options: {},
          data: {}, operator: OP_ADD
        },
        'comment.c2': {
          type: 'comment', id: 'c2', options: {},
          data: {}, operator: OP_ADD
        },
        'comment.c3': {
          type: 'comment', id: 'c3', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        }
      }));

      const actual = transformAddOperations(model, operations);

      const expected = new Map<OpId, AddOperation>(Object.entries({
        'post.p1': {
          type: 'post', id: 'p1', options: {},
          data: { commentIds: ['c1', 'c2', 'c3'] }, operator: OP_ADD
        },
        'comment.c1': {
          type: 'comment', id: 'c1', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        },
        'comment.c2': {
          type: 'comment', id: 'c2', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        },
        'comment.c3': {
          type: 'comment', id: 'c3', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        }
      }));

      expect(actual).toEqual(expected);
    });

    it('links payload operations to state resources', () => {
      const state = {
        comment: {
          resources: {
            'c1': {},
            'c2': {}
          },
          ids: ['c1', 'c2']
        },
        post: {
          resources: {},
          ids: []
        }
      };

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, AddOperation>(Object.entries({
        'post.p1': {
          type: 'post', id: 'p1', options: {},
          data: { commentIds: ['c1', 'c2'] }, operator: OP_ADD
        },
      }));

      const actual = transformAddOperations(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'post.p1': {
          type: 'post', id: 'p1', options: {},
          data: { commentIds: ['c1', 'c2'] }, operator: OP_ADD
        },
        'comment.c1': {
          type: 'comment', id: 'c1',
          data: { postId: 'p1' }, operator: OP_EDIT
        },
        'comment.c2': {
          type: 'comment', id: 'c2',
          data: { postId: 'p1' }, operator: OP_EDIT
        },
      }));

      expect(actual).toEqual(expected);
    });

    it('allows indexing of linked ids', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const operations = new Map<OpId, AddOperation>(Object.entries({
        'post.p1': {
          type: 'post', id: 'p1', options: {},
          data: {}, operator: OP_ADD
        },
        'comment.c1': {
          type: 'comment', id: 'c1', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        },
        'comment.c2': {
          type: 'comment', id: 'c2', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        },
        'comment.c3': {
          type: 'comment', id: 'c3',
          options: { indicesByRelation: { 'post': 1 } },
          data: { postId: 'p1' }, operator: OP_ADD
        }
      }));

      const actual = transformAddOperations(model, operations);

      const expected = new Map<OpId, AddOperation>(Object.entries({
        'post.p1': {
          type: 'post', id: 'p1', options: {},
          data: { commentIds: ['c1', 'c3', 'c2'] }, operator: OP_ADD
        },
        'comment.c1': {
          type: 'comment', id: 'c1', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        },
        'comment.c2': {
          type: 'comment', id: 'c2', options: {},
          data: { postId: 'p1' }, operator: OP_ADD
        },
        'comment.c3': {
          type: 'comment', id: 'c3',
          options: { indicesByRelation: { 'post': 1 } },
          data: { postId: 'p1' }, operator: OP_ADD
        }
      }));

      expect(actual).toEqual(expected);
    });

    it('omits operations with existing resources', () => {
      const state = {
        comment: {
          resources: { 'c1': {} },
          ids: ['c1']
        }
      };

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, AddOperation>(Object.entries({
        'comment.c1': { type: 'comment', id: 'c1', data: {}, options: {}, operator: OP_ADD }
      }));

      const actual = transformAddOperations(model, operations);

      const expected = new Map<OpId, Operation>();

      expect(actual).toEqual(expected);
    });
  });

  describe('toIndicesByRelationKey', () => {
    it('returns a map of relation keys to indices', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const indicesByRelation = {
        'user': 1,
        'postId': 2,
        'parentComment': 3,
        'childIds': 4
      };

      const actual = toIndicesByRelationKey(model, 'comment', indicesByRelation);

      const expected = {
        'userId': 1,
        'postId': 2,
        'parentId': 3,
        'childIds': 4
      };

      expect(actual).toEqual(expected);
    });

    it('omits keys of invalid relation names', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const indicesByRelation = {
        'chicken': 1,
        'comment': 2,
      };

      const actual = toIndicesByRelationKey(model, 'comment', indicesByRelation);

      expect(actual).toEqual({});
    });

    it('returns an object by default', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const actual = toIndicesByRelationKey(model, 'comment', undefined);

      expect(actual).toEqual({});
    });
  });
});
