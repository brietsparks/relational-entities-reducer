import transformReindexRelated from './reindex-related';
import Model from '../model';
import { entities, selectors, nonArrays } from '../mocks';
import { OpId, EditOperation } from '../interfaces';
import { OP_EDIT } from '../constants';

describe('transformers/reindex-related', () => {
  describe('transformReindexRelated', () => {
    const action = {
      type: '',
      resourceType: 'post',
      resourceId: 'p1',
      relation: 'commentIds',
      source: 3,
      destination: 1
    };

    it('reindexes a linked id', () => {
      const state = {
        post: {
          resources: { 'p1': { commentIds: ['c1', 'c2', 'c3', 'c4', 'c5'] } },
          ids: ['p1']
        }
      };

      const model = new Model(entities, selectors, state);

      const actual = transformReindexRelated(model, action);

      const expected = new Map<OpId, EditOperation>(Object.entries({
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: { commentIds: ['c1', 'c4', 'c2', 'c3', 'c5'] },
          options: {},
          operator: OP_EDIT,
        }
      }));

      expect(actual).toEqual(expected);
    });

    describe('ignores unhandlable action', () => {
      test('nonexistent resources', () => {
        const model = new Model(entities, selectors, entities.getEmptyState());
        const actual = transformReindexRelated(model, action);
        const expected = new Map<OpId, EditOperation>();
        expect(actual).toEqual(expected);
      });

      test('no relation key in resource', () => {
        const state = {
          post: {
            resources: { 'p1': {} },
            ids: ['p1']
          }
        };

        const model = new Model(entities, selectors, state);
        const actual = transformReindexRelated(model, action);
        const expected = new Map<OpId, EditOperation>();
        expect(actual).toEqual(expected);
      });

      test('invalid links data', () => {
        nonArrays.forEach(invalidLinks => {
          const state = {
            post: {
              resources: { 'p1': { commentIds: invalidLinks } },
              ids: ['p1']
            }
          };

          const model = new Model(entities, selectors, state);
          const actual = transformReindexRelated(model, action);
          const expected = new Map<OpId, EditOperation>();
          expect(actual).toEqual(expected);
        })
      });

      test('nonexistent source index', () => {
        const state = {
          post: {
            resources: { 'p1': { commentIds: ['c1'] } },
            ids: ['p1']
          }
        };

        const model = new Model(entities, selectors, state);
        const actual = transformReindexRelated(model, action);
        const expected = new Map<OpId, EditOperation>();
        expect(actual).toEqual(expected);
      });
    });
  });
});
