import { Model } from '../model';
import { makeEdit } from './edit';
import { modelSchema, nonObjectOptional, nonStringsOrNumbers } from '../mocks';

describe('action/edit', () => {
  describe('makeEdit', () => {
    const namespace = (type: string) => `n.${type}`;

    it('returns an action TYPE', () => {
      const model = new Model({});
      const { TYPE } = makeEdit(namespace, model);
      expect(TYPE).toEqual('n.EDIT');
    });

    describe('action creator', () => {
      it('returns an action given valid params', () => {
        const model = new Model(modelSchema);
        const { creator, TYPE } = makeEdit(namespace, model);

        const actual = creator(
          { resourceType: 'comment', resourceId: 'c1', data: { text: 'foo' } },
          ['comment', 'c2', { text: 'bar' }],
        );

        const expected = {
          type: TYPE,
          resources: {
            'comment.c1': {
              resourceType: 'comment',
              resourceId: 'c1',
              data: { text: 'foo' },
              options: {}
            },
            'comment.c2': {
              resourceType: 'comment',
              resourceId: 'c2',
              data: { text: 'bar' },
              options: {}
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
          const { creator } = makeEdit(namespace, model);
          const actual = () => creator({ resourceType: 'chicken', resourceId: 'c1', data: {} });
          const error = new Error('model does not have an entity of type "chicken"');
          expect(actual).toThrow(error);
        });

        test('against invalid resource id', () => {
          const { creator } = makeEdit(namespace, model);

          nonStringsOrNumbers.forEach(invalidId => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: invalidId, data: {} });
            const error = new Error('resource id must be a string or number');
            expect(actual).toThrow(error);
          });
        });

        test('against invalid resource data', () => {
          const { creator } = makeEdit(namespace, model);
          nonObjectOptional.forEach(invalidData => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: 'c1', data: invalidData });
            const error = new Error('resource data must be an object literal');
            expect(actual).toThrow(error);
          });
        });
      });
    });
  });
});
