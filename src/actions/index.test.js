const { createEntityActions } = require('./index');
const { schemaDefs } = require('../mocks');

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
  } = createEntityActions(schemaDefs, action => `my-namespace.${action}`);

  describe('add', () => {
    it('throws if entity type dne', () => {
      const actual = () => add('chicken', 'c1');
      const error = new Error('invalid entity type "chicken"');

      expect(actual).toThrow(error);
    });

    describe('happy', () => {
      test('add empty entity', () => {
        const actual = add('project', 'p1');
        const expected = {
          type: ADD,
          entityType: 'project',
          entityId: 'p1',
          entity: {}
        };

        expect(actual).toEqual(expected);
      });

      test('add entity with data', () => {
        const actual = add(
          'project',
          'p1',
          { name: 'my web app' }
        );

        const expected = {
          type: ADD,
          entityType: 'project',
          entityId: 'p1',
          entity: { name: 'my web app' }
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
    it('throws if entity type dne', () => {
      let error, actual;
      error = new Error('invalid entity type "chicken"');

      actual = () => link('skill', 's1', 'chicken', 'c1');
      expect(actual).toThrow(error);

      actual = () => link('chicken', 'c1', 'skill', 's1');
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

  describe('unlink', () => {
    it('throws on invalid entity type', () => {
      let actual, error;
      error = new Error('invalid entity type "chicken"');

      actual = () => unlink('chicken', 'c1', 'skill', 's1');
      expect(actual).toThrow(error);

      actual = () => unlink('skill', 's1', 'chicken', 'c1');
      expect(actual).toThrow(error);
    });

    it('throws if no relation exists between the two types', () => {
      const actual = () => unlink('skill', 's1', 'job', 'j1');
      const error = new Error('cannot unlink a skill from a job because the entity schema contains no relation between the two')

      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const actual = unlink('skill', 's1', 'project', 'p1');
      const expected = {
        type: UNLINK,
        entityType1: 'skill',
        entityId1: 's1',
        entityType2: 'project',
        entityId2: 'p1'
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('reorderEntity', () => {
    it('throws on invalid entity type', () => {
      const actual = () => reorderEntity('chicken', 0, 1);
      const error = new Error('invalid entity type "chicken"');
      expect(actual).toThrow(error);
    });

    it('throws on invalid index', () => {
      let actual, error;

      actual = () => reorderEntity('skill', -1, 1);
      error = new Error('invalid source index. source index must be >=0. given -1');
      expect(actual).toThrow(error);

      actual = () => reorderEntity('skill', 1, -1);
      error = new Error('invalid destination index. destination index must be >=0. given -1');
      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const actual = reorderEntity('skill', 0, 1);
      const expected = {
        type: REORDER_ENTITY,
        entityType: 'skill',
        sourceIndex: 0,
        destinationIndex: 1
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('reorderLink', () => {
    it('throws on invalid entity', () => {
      let actual, error;

      actual = () => reorderLink('chicken', 'c1', 'project', 0, 1, 's2');
      error = new Error('invalid entity type "chicken"');
      expect(actual).toThrow(error);

      actual = () => reorderLink('skill', 's1', 'chicken', 0, 1, 'c1');
      error = new Error('invalid entity type "chicken"');
      expect(actual).toThrow(error);
    });

    it('throws if entity does not have a many-relation of the foreign entity', () => {
      let actual, error;

      actual = () => reorderLink('job', 'j1', 'skill', 0, 1, 's2');
      error = new Error("cannot reorder job entity's skill links because job does not have a many-relation of skill");
      expect(actual).toThrow(error);

      actual = () => reorderLink('skill', 's1', 'job', 0, 1, 'j1');
      error = new Error("cannot reorder skill entity's job links because skill does not have a many-relation of job");
      expect(actual).toThrow(error);

      actual = () => reorderLink('project', 'p1', 'job', 0, 1, 'j1');
      error = new Error("cannot reorder project entity's job links because project does not have a many-relation of job");
      expect(actual).toThrow(error);
    });

    it('throws on invalid index', () => {
      let actual, error;

      actual = () => reorderLink('project', 'p1', 'skill', -1, 1, 's2');
      error = new Error('invalid source index. source index must be >=0. given -1');
      expect(actual).toThrow(error);

      actual = () => reorderLink('project', 'p1', 'skill', 1, -1, 's2');
      error = new Error('invalid destination index. destination index must be >=0. given -1');
      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const actual = reorderLink('project', 'p1', 'skill', 0, 2, 's2');
      const expected = {
        type: REORDER_LINK,
        entityType: 'project',
        entityId: 'p1',
        foreignEntityType: 'skill',
        sourceIndex: 0,
        destinationIndex: 2,
        destinationEntityId: 's2'
      };

      expect(actual).toEqual(expected);
    });
  });
});