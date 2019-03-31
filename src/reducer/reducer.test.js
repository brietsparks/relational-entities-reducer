const { createFullReducer } = require('./reducer');
const { createEntityActions } = require('../actions');
const { schemas, emptyState } = require('../mocks');

describe('createFullReducer', () => {
  const actions = createEntityActions(schemas);
  const reducer = createFullReducer(schemas, actions);

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
  });

});



