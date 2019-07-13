import { makeReindex } from './reindex';
import { Model } from '../model';
import { modelSchema, nonIntegers } from '../mocks';

describe('actions/reindex-resource', () => {
  describe('makeReindex', () => {
    const namespace = (type: string) => `n.${type}`;

    it('returns an action TYPE', () => {
      const model = new Model({});
      const { TYPE } = makeReindex(namespace, model);
      expect(TYPE).toEqual('n.REINDEX');
    });

    describe('action creator', () => {
      it('returns an action given valid params', () => {
        const model = new Model(modelSchema);
        const { TYPE, creator } = makeReindex(namespace, model);

        const actual = creator('post', 5, 1);

        const expected = {
          type: TYPE,
          resourceType: 'post',
          sourceIndex: 5,
          destinationIndex: 1
        };

        expect(actual).toEqual(expected);
      });

      describe('validation', () => {
        const model = new Model(modelSchema);
        const { creator } = makeReindex(namespace, model);

        test('against invalid resource type', () => {
          const actual = () => creator('chicken', 1, 5);
          const error = new Error('model does not have an entity of type "chicken"');
          expect(actual).toThrow(error);
        });

        test('against invalid source index', () => {
          nonIntegers.forEach(invalidInteger => {
            // @ts-ignore
            const actual = () => creator('comment', invalidInteger, 5);
            const error = new Error('index must be an integer');
            expect(actual).toThrow(error);
          });
        });

        test('against invalid destination index', () => {
          nonIntegers.forEach(invalidInteger => {
            // @ts-ignore
            const actual = () => creator('comment', 'c1', 1, invalidInteger);
            const error = new Error('index must be an integer');
            expect(actual).toThrow(error);
          });
        });
      });
    });
  });
});
