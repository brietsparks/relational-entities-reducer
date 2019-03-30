const { validateSchemasObject } = require('./schema');

describe('parseSchema', () => {
  describe('validateSchemas', () => {
    test('schemas key must equal type', () => {
      let actual, error;

      actual = () => validateSchemasObject({ foo: {} });
      error = new Error('schemas key "foo" does not equal its type "undefined"');
      expect(actual).toThrow(error);

      actual = () => validateSchemasObject({ foo: { type: 'bar' } });
      error = new Error('schemas key "foo" does not equal its type "bar"');
      expect(actual).toThrow(error);
    });

    test('many relation entity schema must exist', () => {

    });
  });
});

const schemas = {
  skill: {
    type: 'skill',
    plural: 'skills',
    many: ['projects']
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