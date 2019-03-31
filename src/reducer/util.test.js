const { getLinks, removeLinkedIds } = require('./util');

describe('reducers/util', () => {
  describe('getLinks', () => {
    const schema = {
      type: 'a',
      many: ['b', 'c', 'd'],
      one: ['f', 'g', 'h']
    };

    test('entity with no links', () => {
      const entity = {};
      const actual = getLinks(entity, schema);
      expect(actual).toEqual({});
    });

    test('entity with links', () => {
      const entity = {
        bIds: ['b1', 'b2'],
        cIds: ['c1', 'c2'],
        fId: 'f1',
        gId: 'g1'
      };

      const actual = getLinks(entity, schema);

      const expected = {
        b: {
          key: 'bIds',
          ids: ['b1', 'b2']
        },
        c: {
          key: 'cIds',
          ids: ['c1', 'c2']
        },
        f: {
          key: 'fId',
          ids: ['f1']
        },
        g: {
          key: 'gId',
          ids: ['g1']
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  test('removeLinkedIds', () => {
    const state = {

    };

    removeLinkedIds
  });
});