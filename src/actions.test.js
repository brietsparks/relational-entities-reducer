const { createEntityActions } = require('./actions');

describe('actions', () => {
  const schemas = {
    skill: {
      type: 'skill',
      plural: 'skills',
      many: ['projects']
    },
    project: {
      type: 'project',
      plural: 'projects',
      many: ['skill'],
      one: ['job']
    },
    job: {
      type: 'job',
      plural: 'jobs',
      many: ['project']
    }
  };

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
          entityKey: 'p1',
          entity: {}
        };

        expect(actual).toEqual(expected);
      });
    });
  });
});