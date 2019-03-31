const { createEntityActions } = require('./actions');
const { schemas } = require('./mocks');

describe('actions', () => {
  const {
    ADD,
    EDIT,
    REMOVE,
    LINK,
    UNLINK,
    REORDER_ENTITY,
    REORDER_LINK,
    add,
    remove,
    link,
    unlink,
    reorderEntity,
    reorderLink
  } = createEntityActions(schemas, action => `my-namespace.${action}`);

  describe('add', () => {
    test('throws if entity type dne', () => {
      const actual = () => add('chicken', 'c1');
      const error = new Error('invalid entity type "chicken"');

      expect(actual).toThrow(error);
    });

    describe('happy', () => {
      test('without links', () => {
        const actual = add('project', 'p1');
        const expected = {
          type: ADD,
          entityType: 'project',
          entityId: 'p1',
          entity: {}
        };

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('remove', () => {
    test('throws if entity type dne', () => {
      const actual = () => remove('chicken', 'c1');
      const error = new Error('invalid entity type "chicken"');

      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const actual = remove('project', 'p1');
      const expected = {
        type: REMOVE,
        entityType: 'project',
        entityId: 'p1'
      };
      expect(actual).toEqual(expected);
    });
  });
});