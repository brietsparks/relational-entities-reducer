const { validateSchemasObject, transformSchemasObject } = require('./schema');
const { schemas } = require('./mocks');

describe('parseSchema', () => {
  describe('validateSchemas', () => {
    test('schema key must equal .type', () => {
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
          many: 'bar',
          one: []
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
          many: ['bar'],
          one: []
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
          many: [],
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
          many: [],
          one: ['bar']
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo .one relation "bar" does not have a schema');

      expect(actual).toThrow(error);
    });

    test('entity cannot be of both one and many relation', () => {
      const schemas = {
        foo: {
          type: 'foo',
          one: ['bar'],
          many: ['bar']
        },
        bar: {
          type: 'bar',
          one: ['foo'],
          many: []
        }
      };

      const actual = () => validateSchemasObject(schemas);
      const error = new Error('foo relation to "bar" cannot be both a one and many relation');

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
      },
      project: {
        type: 'project',
        many: ['skill'],
        one: ['job'],
      },
      job: {
        type: 'job',
        many: ['project'],
        one: [],
      }
    };

    expect(actual).toEqual(expected);
  });
});