import { InputResources, makeAdd, convertRelatedIdsToSets } from './add';
import { Model } from '../model';
import { nonStringsOrNumbers, nonObjectOptional, modelSchema } from '../mocks';

describe('actions/add', () => {
  describe('makeAdd', () => {
    const namespace = (type: string) => `n.${type}`;

    it('returns an action TYPE', () => {
      const model = new Model({});
      const namespace = (type: string) => `n.${type}`;
      const { TYPE } = makeAdd(namespace, model);
      expect(TYPE).toEqual('n.ADD');
    });

    describe('action creator', () => {
      it('returns an action given valid params', () => {
        const model = new Model(modelSchema);
        const { TYPE, creator } = makeAdd(namespace, model);

        const actual = creator(
          { resourceType: 'comment', resourceId: 'c1' },
          ['comment', 'c2'],
          { resourceType: 'comment', resourceId: 'c3', data: { text: 'foo' }, options: {} },
          ['comment', 'c4', { text: 'foo' }, {}],
          ['comment', 'c4', { text: 'bar', childIds: ['c5'], postId: 'p2' }, {}],
          { resourceType: 'post', resourceId: 'p1' },
        );

        const expected = {
          type: TYPE,
          resources: new Map(Object.entries({
            'comment.c1': {
              resourceType: 'comment',
              resourceId: 'c1',
              data: {},
              options: {}
            },
            'comment.c2': {
              resourceType: 'comment',
              resourceId: 'c2',
              data: {},
              options: {}
            },
            'comment.c3': {
              resourceType: 'comment',
              resourceId: 'c3',
              data: { text: 'foo' },
              options: {}
            },
            'comment.c4': {
              resourceType: 'comment',
              resourceId: 'c4',
              data: {
                text: 'bar',
                childIds: new Set(['c5']),
                postId: 'p2'
              },
              options: {}
            },
            'post.p1': {
              resourceType: 'post',
              resourceId: 'p1',
              data: {},
              options: {}
            },
          }))
        };

        expect(actual).toEqual(expected);
      });

      describe('validation', () => {
        let model: Model;
        beforeEach(() => {
          model = new Model({ 'comment': {} });
        });

        test('against invalid resource type', () => {
          const { creator } = makeAdd(namespace, model);
          const actual = () => creator({ resourceType: 'chicken', resourceId: 'c1', data: {} });
          const error = new Error('model does not have an entity of type "chicken"');
          expect(actual).toThrow(error);
        });

        test('against invalid resource id', () => {
          const { creator } = makeAdd(namespace, model);

          nonStringsOrNumbers.forEach(invalidId => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: invalidId, data: {} });
            const error = new Error('resource id must be a string or number');
            expect(actual).toThrow(error);
          });
        });

        test('against invalid resource data', () => {
          const { creator } = makeAdd(namespace, model);
          nonObjectOptional.forEach(invalidData => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: 'c1', data: invalidData });
            const error = new Error('resource data must be an object literal');
            expect(actual).toThrow(error);
          });
        });

        test('against invalid resource options', () => {
          const { creator } = makeAdd(namespace, model);
          nonObjectOptional.forEach(invalidOptions => {
            // @ts-ignore
            const actual = () => creator({ resourceType: 'comment', resourceId: 'c1', data: {}, options: invalidOptions });
            const error = new Error('resource options must be an object literal');
            expect(actual).toThrow(error);
          });
        });
      });
    });
  });

  test('convertRelatedIdsToSets', () => {
    const model = new Model(modelSchema);

    const data = {
      authorId: 'u1',
      editorIds: ['u2', 'u3'],
      commentIds: ['c1', 'c2']
    };

    const actual = convertRelatedIdsToSets('post', data, model);

    const expected = {
      authorId: 'u1',
      editorIds: new Set(['u2', 'u3']),
      commentIds: new Set(['c1', 'c2'])
    };

    expect(actual).toEqual(expected);
  });
});
