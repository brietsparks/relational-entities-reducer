const { createEntityReducer } = require('./entity-reducer');
const { createEntityActions } = require('../actions');

describe('createEntityReducer', () => {
  const schema = { type: 'skill' };

  const actions = createEntityActions(schema);
  const reducer = createEntityReducer(schema, actions);

  describe('add', () => {
    test('skip other types', () => {
      const state = {};
      const action = actions.add('project', 'p1', {});

      const actual = reducer(state, action);

      expect(actual).toEqual(state);
    });

    test('add entity', () => {
      const state = {};
      const action = actions.add('skill', 's1', { id: 's1' });

      const actual = reducer(state, action);
      const expected = { 's1': { id: 's1' } };

      expect(actual).toEqual(expected);
    });

    test('', () => {

    });
  });
});

const facts = {
  entities: {
    skills: {
      's1': {
        id: 's1',
        projectKeys: ['p1', 'p2']
      },
      's2': {
        id: 's2',
        projectKeys: ['p1']
      }
    },
    projects: {
      'p1': {
        id: 'p1',
        skillKeys: ['s2', 's1']
      },
      'p2': {
        id: 'p2',
        skillKeys: ['s1']
      }
    }
  },
  keys: {
    skillKeys: ['s1', 's2'],
    projectKeys: ['p2', 'p1']
  }
};