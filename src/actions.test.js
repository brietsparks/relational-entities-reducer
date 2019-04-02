const { createEntityActions } = require('./actions');
const { schemas } = require('./mocks');

describe('actions', () => {
  const {
    ADD,
    REMOVE,
    EDIT,
    LINK,
    UNLINK,
    REORDER_ENTITY,
    REORDER_LINK,
    add,
    remove,
    edit,
    link,
    unlink,
    reorderEntity,
    reorderLink
  } = createEntityActions(schemas, action => `my-namespace.${action}`);

  describe('add', () => {
    it('throws if entity type dne', () => {
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
    it('throws if entity type dne', () => {
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

  describe('edit', () => {
    it('throws if entity type dne', () => {
      const actual = () => edit('chicken', 'c1', {});
      const error = new Error('invalid entity type "chicken"');

      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const actual = edit('project', 'p1', { name: 'My web app' });
      const expected = {
        type: EDIT,
        entityType: 'project',
        entityId: 'p1',
        entity: { name: 'My web app' }
      };

      expect(actual).toEqual(expected);
    });

    it('purges relational data', () => {
      const actual = edit(
        'project',
        'p1',
        { name: 'My web app', skillIds: ['s1'], jobId: 'j1' }
      );
      const expected = {
        type: EDIT,
        entityType: 'project',
        entityId: 'p1',
        entity: { name: 'My web app' }
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('link', () => {
    it('throws if subject entity type dne', () => {
      const actual = () => link('chicken', 'c1', 'skill', 's1');
      const error = new Error('invalid entity type "chicken"');

      expect(actual).toThrow(error);
    });

    it('throws if target entity type dne', () => {
      const actual = () => link('skill', 's1', 'chicken', 'c1');
      const error = new Error('invalid entity type "chicken"');

      expect(actual).toThrow(error);
    });

    it('throws if no relation exists between the two types', () => {
      const actual = () => link('skill', 's1', 'job', 'j1');
      const error = new Error('cannot link a skill with a job because the entity schema contains no relation between the two')

      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const actual = link('skill', 's1', 'project', 'p1');
      const expected = {
        type: LINK,
        entityType1: 'skill',
        entityId1: 's1',
        entityType2: 'project',
        entityId2: 'p1'
      };

      expect(actual).toEqual(expected);
    });
  });
});