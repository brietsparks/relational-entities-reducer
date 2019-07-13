import { groupMapsByType, groupObjectsByType } from './group-by-type';

describe('interceptor/on-add', () => {
  const inputResourcesObject = {
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
  };

  const outputCommentsObject = {
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
  };

  const outputPostsObject = {
    'p2': {
      resourceType: 'post',
      resourceId: 'p2',
      data: {},
      options: {},
    },
  };

  describe('groupMapsByType', () => {
    it('nests resources into groups by resource type', () => {
      const actual = groupMapsByType(new Map(Object.entries(inputResourcesObject)));

      const expected = {
        comment: new Map(Object.entries(outputCommentsObject)),
        post: new Map(Object.entries(outputPostsObject))
      };

      expect(actual).toEqual(expected);
    });

    test('with empty state', () => {
      const actual = groupMapsByType(new Map());

      expect(actual).toEqual({});
    });
  });

  describe('groupObjectsByType', () => {
    it('nests resources into groups by resource type', () => {
      const actual = groupObjectsByType(inputResourcesObject);

      const expected = {
        comment: outputCommentsObject,
        post: outputPostsObject
      };

      expect(actual).toEqual(expected);
    });

    test('with empty state', () => {
      const actual = groupObjectsByType({});

      expect(actual).toEqual({});
    });
  });
});
