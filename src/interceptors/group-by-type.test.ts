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
      const action = {
        type: 'whatever',
        resources: new Map(Object.entries(inputResourcesObject)),
      };

      const actual = groupMapsByType(action);

      const expected = {
        type: 'whatever',
        resources: {
          comment: new Map(Object.entries(outputCommentsObject)),
          post: new Map(Object.entries(outputPostsObject))
        },
      };

      expect(actual).toEqual(expected);
    });

    test('with empty state', () => {
      const action = {
        type: 'whatever',
        resources: new Map()
      };

      const actual = groupMapsByType(action);

      const expected = {
        type: 'whatever',
        resources: {}
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('groupObjectsByType', () => {
    it('nests resources into groups by resource type', () => {
      const action = {
        type: 'whatever',
        resources: inputResourcesObject,
      };

      const actual = groupObjectsByType(action);

      const expected = {
        type: 'whatever',
        resources: {
          comment: outputCommentsObject,
          post: outputPostsObject
        },
      };

      expect(actual).toEqual(expected);
    });

    test('with empty state', () => {
      const action = {
        type: 'whatever',
        resources: {}
      };

      const actual = groupObjectsByType(action);

      const expected = {
        type: 'whatever',
        resources: {}
      };

      expect(actual).toEqual(expected);
    });
  });
});
