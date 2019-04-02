const { getLinks, preReduce } = require('./functions');
const { schemas } = require('../mocks');
const { createEntityActions } = require('../actions');


describe('reducer/functions', () => {
  describe('getLinks', () => {
    const schema = {
      type: 'a',
      many: ['b', 'c', 'd'],
      one: ['f', 'g', 'h']
    };

    test('entity with no links', () => {
      const entity = {};
      const actual = getLinks(entity, schema);
      expect(actual).toEqual({});
    });

    test('entity with links', () => {
      const entity = {
        bIds: ['b1', 'b2'],
        cIds: ['c1', 'c2'],
        fId: 'f1',
        gId: 'g1'
      };

      const actual = getLinks(entity, schema);

      const expected = {
        b: ['b1', 'b2'],
        c: ['c1', 'c2'],
        f: 'f1',
        g: 'g1',
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('pre-reduce', () => {
    const actions = createEntityActions(schemas);
    const { REMOVE, remove } = actions;

    test('on remove', () => {
      const state = {
        skill: {
          entities: {
            's1': { projectIds: ['p1'] },
            's2': { projectIds: ['p1'] }
          },
          ids: ['s1', 's2']
        },
        project: {
          entities: {
            'p1': {
              skillIds: ['s1', 's2'],
              jobId: 'j1'
            },
          },
          ids: ['p1']
        },
        job: {
          entities: {
            'j1': {
              projectIds: ['p1']
            },
          },
          ids: ['j1']
        },
      };

      const action = remove('project', 'p1');
      const actual = preReduce(schemas, actions, state, action);

      const expected = {
        type: REMOVE,
        entityType: 'project',
        entityId: 'p1',
        links: {
          skill: ['s1', 's2'],
          job: 'j1'
        }
      };

      expect(actual).toEqual(expected);
    });
  });
});