import { makeReindexRelated } from './reindex-related';
import { Model } from '../model';
import { modelSchema, nonIntegers, nonStringsOrNumbers } from '../mocks';

describe('actions/reindex-resource', () => {
  describe('makeReindexRelated', () => {
    const namespace = (type: string) => `n.${type}`;

    it('returns an action TYPE', () => {
      const model = new Model({});
      const { TYPE } = makeReindexRelated(namespace, model);
      expect(TYPE).toEqual('n.REINDEX_RELATED');
    });

    describe('action creator', () => {
      it('returns an action given valid params', () => {
        const model = new Model(modelSchema);
        const { TYPE, creator } = makeReindexRelated(namespace, model);

        const actual = creator('post', 'p1', 'commentIds', 5, 1);

        const expected = {
          type: TYPE,
          resourceType: 'post',
          resourceId: 'p1',
          fk: 'commentIds',
          sourceIndex: 5,
          destinationIndex: 1
        };

        expect(actual).toEqual(expected);
      });

      describe('validation', () => {
        const model = new Model(modelSchema);
        const { creator } = makeReindexRelated(namespace, model);

        test('against invalid resource type', () => {
          const actual = () => creator('chicken', 'c1', 'commentIds', 1, 5);
          const error = new Error('model does not have an entity of type "chicken"');
          expect(actual).toThrow(error);
        });

        test('against invalid resource id', () => {
          nonStringsOrNumbers.forEach(invalidId => {
            // @ts-ignore
            const actual = () => creator('comment', invalidId, 'commentIds', 1, 5);
            const error = new Error('resource id must be a string or number');
            expect(actual).toThrow(error);
          });
        });

        test('against invalid fk', () => {
          const actual = () => creator('post', 'p1', 'permissionId', 1, 5);
          const error = new Error('resource of type "post" does not contain a foreign key "permissionId"');
          expect(actual).toThrow(error);
        });

        test('against invalid source index', () => {
          nonIntegers.forEach(invalidInteger => {
            // @ts-ignore
            const actual = () => creator('post', 'p1', 'commentIds', invalidInteger, 5);
            const error = new Error('index must be an integer');
            expect(actual).toThrow(error);
          });
        });

        test('against invalid destination index', () => {
          nonIntegers.forEach(invalidInteger => {
            // @ts-ignore
            const actual = () => creator('post', 'p1', 'commentIds', 1, invalidInteger);
            const error = new Error('index must be an integer');
            expect(actual).toThrow(error);
          });
        });
      });
    });
  });
});
