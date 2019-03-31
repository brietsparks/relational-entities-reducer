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

    describe('remove entity that has link', () => {
      test('via .many', () => {
        const state = {
          entities: {
            skill: {
              's0': { projectIds: ['p1'] },
              's1': { projectIds: ['p1', 'p2'] },
              's2': { projectIds: ['p1'] }
            },
            project: {
              'p1': { skillIds: ['s0', 's1', 's2'] },
              'p2': { skillIds: ['s1'] }
            },
            job: {}
          },
          ids: {
            skill: ['s0', 's1', 's2'],
            project: ['p1', 'p2'],
            job: []
          }
        };

        const action = actions.remove('skill', 's1');
        const actual = reducer(state, action);
        const expected = {
          entities: {
            skill: {
              's0': { projectIds: ['p1'] },
              's2': { projectIds: ['p1'] }
            },
            project: {
              'p1': { skillIds: ['s0', 's2'] },
              'p2': { skillIds: [] }
            },
            job: {}
          },
          ids: {
            skill: ['s0', 's2'],
            project: ['p1', 'p2'],
            job: []
          }
        };

        expect(actual.entities).toEqual(expected.entities);
      });

      test('via .one', () => {
        const state = {
          entities: {
            skill: {},
            project: {
              'p1': { jobId: 'j1' },
              'p2': { jobId: 'j1' },
              'p3': { jobId: 'j2' },
            },
            job: {
              'j1': { projectIds: ['p1', 'p2'] },
              'j2': { projectIds: ['p3'] }
            }
          },
          ids: {
            skill: [],
            project: ['p1', 'p2', 'p3'],
            job: ['j1', 'j2']
          }
        };

        const action = actions.remove('job', 'j1');
        const actual = reducer(state, action);

        const expected = {
          entities: {
            skill: {},
            project: {
              'p1': { jobId: null },
              'p2': { jobId: null },
              'p3': { jobId: 'j2' },
            },
            job: {
              'j2': { projectIds: ['p3'] }
            }
          },
          ids: {
            skill: [],
            project: ['p1', 'p2', 'p3'],
            job: ['j2']
          }
        };

        expect(actual).toEqual(expected);
      });
    });
  });

});



