const { createRootReducer } = require('./index');
const { createEntityActions } = require('../actions');
const { schemas, emptyState } = require('../mocks');

describe('reducer/index', () => {
  const actions = createEntityActions(schemas);
  const reducer = createRootReducer(schemas, actions);

  test('passthrough', () => {
    const actual = reducer(emptyState, { type: '' });
    expect(actual).toEqual(emptyState);
  });

  describe('add', () => {
    test('add entity', () => {
      const state = {
        entities: {
          skill: { 's1': {} },
          project: {},
          job: {}
        },
        ids: {
          skill: ['s1'],
          project: [],
          job: []
        }
      };

      const action = actions.add('skill', 's2', { name: 'Java' });
      const actual = reducer(state, action);
      const expected = {
        entities: {
          skill: {
            's1': {},
            's2': { name: 'Java' }
          },
          project: {},
          job: {}
        },
        ids: {
          skill: ['s1', 's2'],
          project: [],
          job: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('no-op when trying to add an already existing entity', () => {
      const state = {
        entities: {
          skill: { 's1': {} },
          project: {},
          job: {}
        },
        ids: {
          skill: ['s1'],
          project: [],
          job: []
        }
      };

      const action = actions.add('skill', 's1', { name: 'Java' });
      const actual = reducer(state, action);

      expect(actual).toEqual(state);
    });

    test.todo('add entity with linked ids');
  });

  describe('remove', () => {
    test('remove entity that has no links', () => {
      const state = {
        entities: {
          skill: {
            's1': {},
            's2': {},
            's3': {}
          },
          project: {},
          job: {}
        },
        ids: {
          skill: ['s1', 's2', 's3'],
          project: [],
          job: []
        }
      };

      const action = actions.remove('skill', 's2');
      const actual = reducer(state, action);
      const expected = {
        entities: {
          skill: {
            's1': {},
            's3': {}
          },
          project: {},
          job: {}
        },
        ids: {
          skill: ['s1', 's3'],
          project: [],
          job: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('remove entity that has links', () => {
      const state = {
        entities: {
          skill: {
            's1': { projectIds: ['p1', 'p2'] }
          },
          project: {
            'p1': { skillIds: ['s1'] },
            'p2': { skillIds: ['s1'] }
          },
          job: {}
        },
        ids: {
          skill: ['s1'],
          project: ['p1', 'p2'],
          job: []
        }
      };

      const action = actions.remove('skill', 's1');
      const actual = reducer(state, action);
      const expected = {
        entities: {
          skill: {},
          project: {
            'p1': { skillIds: [] },
            'p2': { skillIds: [] }
          },
          job: {}
        },
        ids: {
          skill: [],
          project: ['p1', 'p2'],
          job: []
        }
      };

      // expect(actual).toEqual(expected);
    });
  });

});



