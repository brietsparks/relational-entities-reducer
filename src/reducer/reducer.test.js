const { createFullReducer } = require('./reducer');
const { createEntityActions } = require('../actions');

describe('createFullReducer', () => {
  const schemas = {
    skill: {
      type: 'skill',
      plural: 'skills',
      many: ['project']
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

  const actions = createEntityActions(schemas);
  const reducer = createFullReducer(schemas, actions);

  test('add', () => {
    const state = {
      entities: {

      },
      keys: {
        skillKeys: [],

      }
    };
  });

  // describe('add', () => {
  //   test('add empty entity', () => {
  //     const state = {
  //       entities: {
  //         skills: { 's1': {} },
  //         projects: {},
  //         jobs: {}
  //       },
  //       keys: {
  //         skills: ['s1'],
  //         projects: [],
  //         jobs: []
  //       }
  //     };
  //
  //     const action = actions.add('skill', 's1');
  //     const actual = reducer(state, action);
  //     const expected = {
  //       entities: {
  //         skills: { 's1': {}, 's2': {} },
  //         projects: {},
  //         jobs: {}
  //       },
  //       keys: {
  //         skills: ['s1', 's2'],
  //         projects: [],
  //         jobs: []
  //       }
  //     };
  //
  //     expect(actual).toEqual(expected);
  //   });
  // });

});



