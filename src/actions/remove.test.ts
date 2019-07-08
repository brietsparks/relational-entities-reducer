import { makeRemove } from './remove';
import { Model } from '../model';
import { nonStringsOrNumbers, nonObjectOptional, modelSchema } from '../mocks';

describe('actions/remove', () => {
  describe('makeRemove', () => {
    const namespace = (type: string) => `n.${type}`;

    it('returns an action TYPE', () => {
      const model = new Model({});
      const { TYPE } = makeRemove(namespace, model);
      expect(TYPE).toEqual('n.REMOVE');
    });

    describe('action creator', () => {
      it('returns an action given valid props', () => {
        const model = new Model(modelSchema);
        const { TYPE, creator } = makeRemove(namespace, model);

        const actual = creator(
          ['comment', 'c1'],
          {
            resourceType: 'post',
            resourceId: 'p1',
            options: { removeRelated: {} }
          },
        );

        const expected = {
          type: TYPE,
          remove: {
            'comment.c1': {
              resourceType: 'comment',
              resourceId: 'c1',
              options: {}
            },
            'post.p1': {
              resourceType: 'post',
              resourceId: 'p1',
              options: { removeRelated: {} }
            }
          }
        };

        expect(actual).toEqual(expected);
      });

      describe('validation', () => {
        let model: Model;
        beforeEach(() => {
          model = new Model({ 'comment': {} });
        });

        test('against invalid resource type', () => {
          const { creator } = makeRemove(namespace, model);
          const actual = () => creator({ resourceType: 'chicken', resourceId: 'c1' });
          const error = new Error('model does not have an entity of type "chicken"');
          expect(actual).toThrow(error);
        });

        test('against invalid resource id', () => {
          const { creator } = makeRemove(namespace, model);

          nonStringsOrNumbers.forEach(invalidId => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: invalidId });
            const error = new Error('resource id must be a string or number');
            expect(actual).toThrow(error);
          })
        });

        test('against invalid resource id', () => {
          const { creator } = makeRemove(namespace, model);

          nonObjectOptional.forEach(invalidOptions => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: 'c1', options: invalidOptions });
            const error = new Error('resource options must be an object literal');
            expect(actual).toThrow(error);
          })
        });
      });
    });
  });
});
