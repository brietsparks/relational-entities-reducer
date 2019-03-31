const { validateSchemasObject, transformSchemasObject } = require('./schema');
const { schemas } = require('./mocks');

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

    test('schema .many must be an array', () => {
      const schemas = {
        foo: {
          type: 'foo',
          many: 'bar'
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo schema .many must be an array');

      expect(actual).toThrow(error);
    });

    test('many-relation entity schema must exist', () => {
      const schemas = {
        foo: {
          type: 'foo',
          many: ['bar']
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo .many relation "bar" does not have a schema');

      expect(actual).toThrow(error);
    });

    test('schema .one must be an array', () => {
      const schemas = {
        foo: {
          type: 'foo',
          one: 'bar'
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo schema .one must be an array');

      expect(actual).toThrow(error);
    });

    test('one-relation entity schema must exist', () => {
      const schemas = {
        foo: {
          type: 'foo',
          one: ['bar']
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo .one relation "bar" does not have a schema');

      expect(actual).toThrow(error);
    });

    test('valid', () => {
      validateSchemasObject(schemas);
    });
  });

  test('transformSchemasObject', () => {
    const actual = transformSchemasObject(schemas);
    const expected = {
      skill: {
        type: 'skill',
        many: ['project'],
        one: [],
        idsKeys: ['projectIds'],
        idKeys: []
      },
      project: {
        type: 'project',
        many: ['skill'],
        one: ['job'],
        idsKeys: ['skillIds'],
        idKeys: ['jobId']
      },
      job: {
        type: 'job',
        many: ['project'],
        one: [],
        idsKeys: ['projectIds'],
        idKeys: []
      }
    };

    expect(actual).toEqual(expected);
  });
});