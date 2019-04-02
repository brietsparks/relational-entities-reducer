const {
  getEntityState,
  getEntities,
  getIds,
  getEntity
} = require('./selectors');

describe('selectors', () => {
  test('getEntityState', () => {
    const state = {
      skill: {
        entities: {},
        ids: []
      }
    };

    const actual = getEntityState(state, { entityType: 'skill' });
    const expected = {
      entities: {},
      ids: []
    };

    expect(actual).toEqual(expected);
  });

  describe('getEntities', () => {
    it('throws on non-existent entity state', () => {
      const state = {
        skill: {
          entities: {},
          ids: []
        }
      };

      const actual = () => getEntities(state, { entityType: 'chicken' });
      const error = new Error('no state found for entity type "chicken"');

      expect(actual).toThrow(error);
    });

    it('returns an existing entity state', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        }
      };

      const actual = getEntities(state, { entityType: 'skill' });
      const expected = { 's1': {} };

      expect(actual).toEqual(expected);
    });
  });

  describe('getIds', () => {
    it('throws on non-existent entity state', () => {
      const state = {
        skill: {
          entities: {},
          ids: []
        }
      };

      const actual = () => getIds(state, { entityType: 'chicken' });
      const error = new Error('no state found for entity type "chicken"');

      expect(actual).toThrow(error);
    });

    it('returns an existing entity state', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        }
      };

      const actual = getIds(state, { entityType: 'skill' });
      const expected = ['s1'];

      expect(actual).toEqual(expected);
    });
  });

  describe('getEntity', () => {
    it('throws on non-existent entity state', () => {
      const state = {
        skill: {
          entities: {},
          ids: []
        }
      };

      const actual = () => getEntity(state, { entityType: 'chicken', entityId: '' });
      const error = new Error('no state found for entity type "chicken"');

      expect(actual).toThrow(error);
    });

    it('returns an entity', () => {
      const state = {
        skill: {
          entities: { 's1': { name: 'skill 1' } },
          ids: ['s1']
        }
      };

      const actual = getEntity(state, { entityType: 'skill', entityId: 's1' });
      const expected = { name: 'skill 1' };

      expect(actual).toEqual(expected);
    });

    it('returns undefined when not found', () => {
      const state = {
        skill: {
          entities: { 's1': { name: 'skill 1' } },
          ids: ['s1']
        }
      };

      const actual = getEntity(state, { entityType: 'skill', entityId: 's100' });

      expect(actual).toEqual(undefined);
    });
  });
});