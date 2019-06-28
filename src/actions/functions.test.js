const { purgeRelationalData } = require('./functions');
const { schemas } = require('../mocks');

describe('actions/functions', () => {
  describe('purgeRelationalData', () => {
    test('no-op if no foreign keys', () => {
      const schema = schemas.get('project');
      const project = { name: 'my web app' };

      purgeRelationalData(schema, project);
      const expected = { name: 'my web app' };

      expect(project).toEqual(expected);
    });

    it('purges relational data (foreign keys) from an entity', () => {
      const schema = schemas.get('project');
      const project = {
        name: 'my web app',
        jobId: 'j1',
        skillIds: ['s1']
      };

      purgeRelationalData(schema, project);
      const expected = { name: 'my web app' };

      expect(project).toEqual(expected);
    });
  });
});