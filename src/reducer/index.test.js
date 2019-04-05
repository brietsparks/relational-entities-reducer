const { createRootReducer } = require('./index');
const { createEntityActions } = require('../actions');
const { schemaDefs, emptyState } = require('../mocks');

describe('reducer/index', () => {
  const actions = createEntityActions(schemaDefs);
  const reducer = createRootReducer(schemaDefs, actions);

  test('default state', () => {
    const actual = reducer(undefined, { type: '' });
    expect(actual).toEqual(emptyState);
  });

  test('passthrough', () => {
    const actual = reducer(emptyState, { type: '' });
    expect(actual).toEqual(emptyState);
  });

  describe('add', () => {
    test('add entity', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1'],
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        }
      };

      const action = actions.add('skill', 's2', { name: 'Java' });
      const actual = reducer(state, action);
      const expected = {
        skill: {
          entities: {
            's1': {},
            's2': { name: 'Java' }
          },
          ids: ['s1', 's2'],
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('no-op when trying to add an already existing entity', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        }
      };

      const action = actions.add('skill', 's1', { name: 'Java' });
      const actual = reducer(state, action);

      expect(actual).toEqual(state);
    });

    test('add entity with linked ids', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: { 'j1': {} },
          ids: ['j1']
        },
      };

      const entity = {
        skillIds: ['s1', 's2'],
        jobId: 'j1',
        name: 'my web app'
      };

      const action = actions.add('project', 'p1', entity);

      const actual = reducer(state, action);

      const expected = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: {
            'p1': {
              name: 'my web app',
              skillIds: ['s1'],
              jobId: 'j1'
            }
          },
          ids: ['p1']
        },
        job: {
          entities: { 'j1': {} },
          ids: ['j1']
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('remove', () => {
    test('remove entity that has no links', () => {
      const state = {
        skill: {
          entities: {
            's1': {},
            's2': {},
            's3': {}
          },
          ids: ['s1', 's2', 's3']
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        },
      };

      const action = actions.remove('skill', 's2');
      const actual = reducer(state, action);
      const expected = {
        skill: {
          entities: {
            's1': {},
            's3': {}
          },
          ids: ['s1', 's3']
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        },
      };

      expect(actual).toEqual(expected);
    });

    describe('remove entity that has link', () => {
      test('via .many', () => {
        const state = {
          skill: {
            entities: {
              's0': { projectIds: ['p1'] },
              's1': { projectIds: ['p1', 'p2'] },
              's2': { projectIds: ['p1'] }
            },
            ids: ['s0', 's1', 's2']
          },
          project: {
            entities: {
              'p1': { skillIds: ['s0', 's1', 's2'] },
              'p2': { skillIds: ['s1'] }
            },
            ids: ['p1', 'p2'],
          },
          job: {
            entities: {},
            ids: []
          },
        };

        const action = actions.remove('skill', 's1');
        const actual = reducer(state, action);

        const expected = {
          skill: {
            entities: {
              's0': { projectIds: ['p1'] },
              's2': { projectIds: ['p1'] }
            },
            ids: ['s0', 's2']
          },
          project: {
            entities: {
              'p1': { skillIds: ['s0', 's2'] },
              'p2': { skillIds: [] }
            },
            ids: ['p1', 'p2'],
          },
          job: {
            entities: {},
            ids: []
          },
        };

        expect(actual.entities).toEqual(expected.entities);
      });

      test('via .one', () => {
        const state = {
          skill: {
            entities: {},
            ids: []
          },
          project: {
            entities: {
              'p1': { jobId: 'j1' },
              'p2': { jobId: 'j1' },
              'p3': { jobId: 'j2' },
            },
            ids: ['p1', 'p2', 'p3']
          },
          job: {
            entities: {
              'j1': { projectIds: ['p1', 'p2'] },
              'j2': { projectIds: ['p3'] }
            },
            ids: ['j1', 'j2']
          },
        };

        const action = actions.remove('job', 'j1');
        const actual = reducer(state, action);

        const expected = {
          skill: {
            entities: {},
            ids: []
          },
          project: {
            entities: {
              'p1': { jobId: null },
              'p2': { jobId: null },
              'p3': { jobId: 'j2' },
            },
            ids: ['p1', 'p2', 'p3']
          },
          job: {
            entities: {
              'j2': { projectIds: ['p3'] }
            },
            ids: ['j2']
          },
        };

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('edit', () => {
    test('edit entity attributes', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        }
      };

      const action = actions.edit('skill', 's1', { name: 'Java' });
      const actual = reducer(state, action);
      const expected = {
        skill: {
          entities: { 's1': { name: 'Java' } },
          ids: ['s1']
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('no-op when attempting to edit relational data', () => {
      const state = {
        skill: {
          entities: {},
          ids: []
        },
        project: {
          entities: { 'p1': {} },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        }
      };

      const action = actions.edit('project', 'p1', {
        name: 'My web app',
        skillIds: ['s1'],
        jobId: 'j1'
      });
      const actual = reducer(state, action);
      const expected = {
        skill: {
          entities: {},
          ids: []
        },
        project: {
          entities: { 'p1': { name: 'My web app' } },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('no-op when attempting to edit a non-existent entity', () => {
      const action = actions.edit('skill', 's1', { name: 'Java' });
      const actual = reducer(emptyState, action);
      expect(actual).toEqual(emptyState);
    });
  });

  describe('link', () => {
    test('no-op when entity does not exist', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: { 'p1': {} },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        },
      };

      let action, actual;
      action = actions.link('skill', 's1', 'project', 'p1000');
      actual = reducer(state, action);
      expect(actual).toEqual(state);

      action = actions.link('skill', 's1000', 'project', 'p1');
      actual = reducer(state, action);
      expect(actual).toEqual(state);
    });

    test('no-op when entities are already linked', () => {
      const state = {
        skill: {
          entities: {
            's1': { projectIds: ['p1'] },
          },
          ids: ['s1']
        },
        project: {
          entities: {
            'p1': { skillIds: ['s1'] }
          },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        },
      };

      const action = actions.link('skill', 's1', 'project', 'p1');
      const actual = reducer(state, action);

      expect(actual).toEqual(state);
    });

    test('link two unlinked entities', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: { 'p1': {} },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        },
      };

      const action = actions.link('skill', 's1', 'project', 'p1');
      const actual = reducer(state, action);

      const expected = {
        skill: {
          entities: {
            's1': { projectIds: ['p1'] },
          },
          ids: ['s1']
        },
        project: {
          entities: {
            'p1': { skillIds: ['s1'] }
          },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('unlink', () => {
    test('no-op when entities are not linked', () => {
      const state = {
        skill: {
          entities: { 's1': {} },
          ids: ['s1']
        },
        project: {
          entities: { 'p1': {} },
          ids: ['p1']
        },
        job: {
          entities: {},
          ids: []
        },
      };

      let action, actual;
      action = actions.unlink('skill', 's1', 'project', 'p1000');
      actual = reducer(state, action);
      expect(actual).toEqual(state);
    });

    test('no-op when both entities do not exist', () => {
      const state = {
        skill: {
          entities: {},
          ids: []
        },
        project: {
          entities: {},
          ids: []
        },
        job: {
          entities: {},
          ids: []
        },
      };

      let action, actual;
      action = actions.unlink('skill', 's1', 'project', 'p1000');
      actual = reducer(state, action);
      expect(actual).toEqual(state);
    });

    describe('unlink two linked entities', () => {
      test('many relation', () => {
        const state = {
          skill: {
            entities: {
              's0': { projectIds: ['p1'] },
              's1': { projectIds: ['p0', 'p1', 'p2'] },
              's2': { projectIds: ['p1'] },
            },
            ids: ['s0', 's1', 's2']
          },
          project: {
            entities: {
              'p0': { skillIds: ['s1'] },
              'p1': { skillIds: ['s0', 's1', 's2'] },
              'p2': { skillIds: ['s1'] },
            },
            ids: ['p0', 'p1', 'p2']
          },
          job: {
            entities: {},
            ids: []
          },
        };

        const action = actions.unlink('skill', 's1', 'project', 'p1');
        const actual = reducer(state, action);
        const expected = {
          skill: {
            entities: {
              's0': { projectIds: ['p1'] },
              's1': { projectIds: ['p0', 'p2'] },
              's2': { projectIds: ['p1'] },
            },
            ids: ['s0', 's1', 's2']
          },
          project: {
            entities: {
              'p0': { skillIds: ['s1'] },
              'p1': { skillIds: ['s0', 's2'] },
              'p2': { skillIds: ['s1'] },
            },
            ids: ['p0', 'p1', 'p2']
          },
          job: {
            entities: {},
            ids: []
          },
        };

        expect(actual).toEqual(expected);
      });

      test('one relation', () => {
        const state = {
          skill: {
            entities: {},
            ids: []
          },
          project: {
            entities: {
              'p0': { jobId: 'j1' },
              'p1': { jobId: 'j1' },
              'p2': { jobId: 'j1' },
            },
            ids: ['p0', 'p1', 'p2']
          },
          job: {
            entities: {
              'j1': { projectIds: ['p0', 'p1', 'p2'] }
            },
            ids: ['j1']
          },
        };

        const expected = {
          skill: {
            entities: {},
            ids: []
          },
          project: {
            entities: {
              'p0': { jobId: 'j1' },
              'p1': { jobId: null },
              'p2': { jobId: 'j1' },
            },
            ids: ['p0', 'p1', 'p2']
          },
          job: {
            entities: {
              'j1': { projectIds: ['p0', 'p2'] }
            },
            ids: ['j1']
          },
        };

        let action, actual;

        // test both combinations to ensure that the remove of the
        // one-relation entity id occurs in both the entity and
        // the foreign entity
        action = actions.unlink('job', 'j1', 'project', 'p1');
        actual = reducer(state, action);
        expect(actual).toEqual(expected);

        action = actions.unlink('project', 'p1', 'job', 'j1');
        actual = reducer(state, action);
        expect(actual).toEqual(expected);
      });
    });

    describe('unlinking given an invalid state', () => {
      test('many relation', () => {
        const state = {
          skill: {
            entities: {
              's1': { projectIds: [] },
            },
            ids: ['s1']
          },
          project: {
            entities: {
              'p1': { skillIds: ['s1'] },
            },
            ids: ['p1']
          },
          job: {
            entities: {},
            ids: []
          },
        };
        const action = actions.unlink('skill', 's1', 'project', 'p1');
        const actual = reducer(state, action);

        const expected = {
          skill: {
            entities: {
              's1': { projectIds: [] },
            },
            ids: ['s1']
          },
          project: {
            entities: {
              'p1': { skillIds: [] },
            },
            ids: ['p1']
          },
          job: {
            entities: {},
            ids: []
          },
        };

        expect(actual).toEqual(expected);
      });

      test('one relation', () => {
        const state = {
          skill: {
            entities: {},
            ids: []
          },
          project: {
            entities: {
              'p1': { jobId: 'j1' },
            },
            ids: ['p1']
          },
          job: {
            entities: {
              'j1': {}
            },
            ids: ['j1']
          },
        };

        const expected = {
          skill: {
            entities: {},
            ids: []
          },
          project: {
            entities: {
              'p1': { jobId: null },
            },
            ids: ['p1']
          },
          job: {
            entities: {
              'j1': {}
            },
            ids: ['j1']
          },
        };

        let action, actual;

        action = actions.unlink('job', 'j1', 'project', 'p1');
        actual = reducer(state, action);
        expect(actual).toEqual(expected);

        action = actions.unlink('project', 'p1', 'job', 'j1');
        actual = reducer(state, action);
        expect(actual).toEqual(expected);
      });
    });
  });
});
