import convertToPrimitives, { convertRelatedIdsToArray } from './convert-to-primitives';
import { Model } from '../../model';
import { modelSchema } from '../../mocks';

describe('interceptors/on-add/convert-to-primitives', () => {
  const model = new Model(modelSchema);

  test('convertToPrimitives', () => {
    const action = {
      type: 'whatever',
      resources: {
        comment: new Map(Object.entries({
          'c1': {
            resourceType: 'comment',
            resourceId: 'c1',
            data: { text: 'foo' },
            options: {}
          },
          'c2': {
            resourceType: 'comment',
            resourceId: 'c2',
            data: { parentId: 'c0', childIds: new Set(['c2', 'c3']) },
            options: { ignoreIdIndex: true }
          },
          'c3': {
            resourceType: 'comment',
            resourceId: 'c3',
            data: {},
            options: {}
          },
        })),
        post: new Map(Object.entries({
          'p1': {
            resourceType: 'post',
            resourceId: 'p1',
            data: {},
            options: {}
          },
        }))
      }
    };

    const actual = convertToPrimitives(model, action);

    const expected = {
      type: 'whatever',
      resources: {
        comment: {
          'c1': {
            resourceType: 'comment',
            resourceId: 'c1',
            data: { text: 'foo' },
            options: {}
          },
          'c2': {
            resourceType: 'comment',
            resourceId: 'c2',
            data: { parentId: 'c0', childIds: ['c2', 'c3'] },
            options: { ignoreIdIndex: true }
          },
          'c3': {
            resourceType: 'comment',
            resourceId: 'c3',
            data: {},
            options: {}
          },
        },
        post: {
          'p1': {
            resourceType: 'post',
            resourceId: 'p1',
            data: {},
            options: {}
          }
        }
      },
      ids: {
        comment: ['c1', 'c3'],
        post: ['p1']
      }
    };

    expect(actual).toEqual(expected);
  });

  test('convertRelatedIdsToArray', () => {
    const data = {
      authorId: 'u1',
      editorIds: new Set(['u2', 'u3']),
      commentIds: new Set(['c1', 'c2'])
    };

    const actual = convertRelatedIdsToArray('post', data, model);

    const expected = {
      authorId: 'u1',
      editorIds: ['u2', 'u3'],
      commentIds: ['c1', 'c2']
    };

    expect(actual).toEqual(expected);
  });
});
