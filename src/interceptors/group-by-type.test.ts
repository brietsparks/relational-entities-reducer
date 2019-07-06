import groupByType from './group-by-type';

describe('interceptor/on-add', () => {
  it('nests resources into groups by resource type', () => {
    const action = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c1': {
          resourceType: 'comment',
          resourceId: 'c1',
          data: {},
          options: {},
        },
        'comment.c3': {
          resourceType: 'comment',
          resourceId: 'c3',
          data: {},
          options: {},
        },
        'post.p2': {
          resourceType: 'post',
          resourceId: 'p2',
          data: {},
          options: {},
        },
      })),
    };

    const actual = groupByType(action);

    const expected = {
      type: 'whatever',
      resources: {
        comment: new Map(Object.entries({
          'c1': {
            resourceType: 'comment',
            resourceId: 'c1',
            data: {},
            options: {},
          },
          'c3': {
            resourceType: 'comment',
            resourceId: 'c3',
            data: {},
            options: {},
          }
        })),
        post: new Map(Object.entries({
          'p2': {
            resourceType: 'post',
            resourceId: 'p2',
            data: {},
            options: {},
          },
        }))
      },
    };

    expect(actual).toEqual(expected);
  });

  test('with empty state', () => {
    const action = {
      type: 'whatever',
      resources: new Map()
    };

    const actual = groupByType(action);

    const expected = {
      type: 'whatever',
      resources: {}
    };

    expect(actual).toEqual(expected);
  });
});
