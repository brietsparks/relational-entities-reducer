const { removeLinkedIds } = require('./functions');
const { schemas } = require('../../mocks');

describe('reducer/entities/functions', () => {
  describe('removeLinkedIds', () => {
    test('with linked .many entities', () => {

      // we want to remove skill "s1"
      const removableEntityType = 'skill';
      const removableEntityId = 's1';

      // ...but project "p1" and "p3" are linked to it
      const state = {
        'p1': { skillIds: ['s0', 's1', 's2'] },
        'p2': { skillIds: ['s1'] },
        'p3': { skillIds: ['s0'] }
      };

      // a lookup containing project ids linked to skill "s1"
      const links = {
        project: ['p1', 'p2']
      };

      // unlink skill "s1" from those projects
      const actual = removeLinkedIds(
        state,
        links,
        schemas.project,
        removableEntityType,
        removableEntityId
      );

      // "s1" is gone from the projects
      const expected = {
        'p1': { skillIds: ['s0', 's2'] },
        'p2': { skillIds: [] },
        'p3': { skillIds: ['s0'] }
      };

      expect(actual).toEqual(expected);

      // not mutated
      expect(actual).not.toBe(expected);
      expect(actual['p1']).not.toBe(expected['p1']);
      expect(actual['p2']).not.toBe(expected['p2']);
      expect(actual['p1'].skillIds).not.toBe(expected['p1'].skillIds);
      expect(actual['p2'].skillIds).not.toBe(expected['p2'].skillIds);
    });

    test('with linked .one entity', () => {
      // we want to remove job "j1"
      const removableEntityType = 'job';
      const removableEntityId = 'j1';

      // ...but project "p1" is linked to it
      const state = {
        'p1': { jobId: 'j1' }
      };

      // a lookup containing the project id linked to job "j1"
      const links = {
        project: 'p1'
      };

      // unlink job "j1" from that project
      const actual = removeLinkedIds(
        state,
        links,
        schemas.project,
        removableEntityType,
        removableEntityId
      );

      // "j1" is gone from the project
      const expected = {
        'p1': { jobId: null }
      };

      expect(actual).toEqual(expected);

      // not mutated
      expect(actual).not.toBe(expected);
      expect(actual['p1']).not.toBe(expected['p1']);
    });

    test('with no linked entities', () => {
      const state = {
        's1': {},
        's2': {}
      };

      const links = {
        skill: [],
      };

      const actual = removeLinkedIds(state, links, schemas.skill, 'project', 'p1');

      expect(actual).toEqual(state);
    });

    test('with invalid state', () => {
      const state = {
        's1': {},
        's2': {}
      };

      const links = {
        skill: ['s1', 's2'],
      };

      const actual = removeLinkedIds(state, links, schemas.skill, 'project', 'p1');

      expect(actual).toEqual(state);
    });
  });
});