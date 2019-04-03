const { getLinks, preReduce } = require('./functions');
const { schemaDefs, schemas } = require('../mocks');
const { createEntityActions } = require('../actions');


describe('reducer/functions', () => {
  describe('pre-reduce', () => {
    const actions = createEntityActions(schemaDefs);
    const {
      ADD, add,
      REMOVE, remove,
      LINK, link
    } = actions;

    describe('on add', () => {
      test('appends .entityExists to the action when the entity already exists', () => {
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
          },
        };

        const action = add('skill', 's1');
        const actual = preReduce(schemas, actions, state, action);
        const expected = {
          type: ADD,
          entityType: 'skill',
          entityId: 's1',
          entity: {},
          entityExists: true
        };

        expect(actual).toEqual(expected);
      });

      test('no-op when entity does not exist', () => {
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

        const action = add('skill', 's1');
        const actual = preReduce(schemas, actions, state, action);
        expect(actual).toEqual(action);
      });
    });

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

    describe('on link', () => {
      test('appends .entityDoesNotExist when one of the entities does not exist', () => {
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
          },
        };

        let action, actual, expected;
        action = link('project', 'p1', 'skill', 's1');
        actual = preReduce(schemas, actions, state, action);
        expected = {
          type: LINK,
          entityType1: 'project',
          entityId1: 'p1',
          entityType2: 'skill',
          entityId2: 's1',
          entityDoesNotExist: true
        };

        expect(actual).toEqual(expected);

        action = link('skill', 's1', 'project', 'p1');
        actual = preReduce(schemas, actions, state, action);
        expected = {
          type: LINK,
          entityType1: 'skill',
          entityId1: 's1',
          entityType2: 'project',
          entityId2: 'p1',
          entityDoesNotExist: true
        };

        expect(actual).toEqual(expected);
      });

      test('no-op when both entities exist', () => {
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

        const action = link('skill', 's1', 'project', 'p1');
        const actual = preReduce(schemas, actions, state, action);
        expect(actual).toEqual(action);
      });
    });
  });

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
});