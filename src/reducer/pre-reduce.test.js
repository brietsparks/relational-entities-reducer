const { preReduce } = require('./pre-reduce');
const { schemas } = require('../mocks');
const { createEntityActions } = require('../actions');

describe('pre-reduce', () => {
  const actions = createEntityActions(schemas);
  const { REMOVE, remove } = actions;

  test('on remove', () => {
    const state = {
      entities: {
        skill: {
          's1': { projectIds: ['p1'] },
          's2': { projectIds: ['p1'] }
        },
        project: {
          'p1': {
            skillIds: ['s1', 's2'],
            jobId: 'j1'
          },
        },
        job: {
          'j1': {
            projectIds: ['p1']
          }
        }
      },
      ids: {
        skill: ['s1', 's2'],
        project: ['p1'],
        job: ['j1']
      }
    };

    const action = remove('project', 'p1');
    const actual = preReduce(schemas, actions, state, action);

    const expected = {
      type: REMOVE,
      entityType: 'project',
      entityId: 'p1',
      links: {
        skill: {
          key: 'skillIds',
          ids: ['s1', 's2']
        },
        job: {
          key: 'jobId',
          ids: ['j1']
        }
      }
    };

    expect(actual).toEqual(expected);
  });
});