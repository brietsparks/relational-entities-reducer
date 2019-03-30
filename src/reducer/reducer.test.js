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
          skills: { 's1': {} },
          projects: {},
          jobs: {}
        },
        keys: {
          skillKeys: ['s1'],
          projectKeys: [],
          jobKeys: []
        }
      };

      const action = actions.add('skill', 's2', { name: 'Java' });
      const actual = reducer(state, action);
      const expected = {
        entities: {
          skills: {
            's1': {},
            's2': { name: 'Java' }
          },
          projects: {},
          jobs: {}
        },
        keys: {
          skillKeys: ['s1', 's2'],
          projectKeys: [],
          jobKeys: []
        }
      };

      expect(actual).toEqual(expected);
    });
  });

});



