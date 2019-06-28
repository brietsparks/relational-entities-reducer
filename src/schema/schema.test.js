const { Schema, Schemas } = require('./schema');
const { schemaDefs } = require('../mocks');

describe('schema/schema', () => {
  describe('Schema', () => {
    const schema = new Schema(schemaDefs.project);

    test('getManyForeignKeys', () => {
      const actual = schema.getManyForeignKeys();
      const expected = ['skillIds'];
      expect(actual).toEqual(expected);
    });

    test('getOneForeignKeys', () => {
      const actual = schema.getOneForeignKeys();
      const expected = ['jobId'];
      expect(actual).toEqual(expected);
    });

    test('getForeignKeys', () => {
      const actual = schema.getForeignKeys();
      const expected = ['skillIds', 'jobId'];
      expect(actual).toEqual(expected);
    });

    describe('getOneForeignKey', () => {
      test('happy', () => {
        const actual = schema.getOneForeignKey('job');
        expect(actual).toEqual('jobId');
      });

      test('throws if no relation', () => {
        const actual = () => schema.getOneForeignKey('chicken');
        const error = new Error(`project has no one-relation of "chicken", so no foreign key was found`);
        expect(actual).toThrow(error);
      });

      test('option to bypass throw', () => {
        const actual = schema.getOneForeignKey('chicken', false);
        expect(actual).toEqual(undefined);
      });
    });

    describe('getManyForeignKey', () => {
      test('happy', () => {
        const actual = schema.getManyForeignKey('skill');
        expect(actual).toEqual('skillIds');
      });

      test('throws if no relation', () => {
        const actual = () => schema.getManyForeignKey('chicken');
        const error = new Error(`project has no many-relation of "chicken", so no foreign key was found`);
        expect(actual).toThrow(error);
      });

      test('option to bypass throw', () => {
        const actual = schema.getManyForeignKey('chicken', false);
        expect(actual).toEqual(undefined);
      });
    });

    describe('getForeignKey', () => {
      it('can get a many-fk', () => {
        const actual = schema.getForeignKey('skill');
        expect(actual).toEqual('skillIds');
      });

      it('can get a one-fk', () => {
        const actual = schema.getForeignKey('job');
        expect(actual).toEqual('jobId');
      });

      test('throws if no relation', () => {
        const actual = () => schema.getForeignKey('chicken');
        const error = new Error(`project has no relation to "chicken", so no foreign key was found`);
        expect(actual).toThrow(error);
      });

      test('option to bypass throw', () => {
        const actual = schema.getForeignKey('chicken', false);
        expect(actual).toEqual(undefined);
      });
    });

    describe('getOneEntityType', () => {
      test('happy', () => {
        const actual = schema.getOneEntityType('jobId');
        expect(actual).toEqual('job');
      });

      test('throws foreign key does not exist', () => {
        const actual = () => schema.getOneEntityType('chickenId');
        const error = new Error(`project has no one-relation foreign key "chickenId", so no entity type was found`);
        expect(actual).toThrow(error);
      });

      test('option to bypass throw', () => {
        const actual = schema.getOneEntityType('chickenId', false);
        expect(actual).toEqual(undefined);
      });
    });

    describe('getManyEntityType', () => {
      test('happy', () => {
        const actual = schema.getManyEntityType('skillIds');
        expect(actual).toEqual('skill');
      });

      test('throws if foreign key does not exist', () => {
        const actual = () => schema.getManyEntityType('chickenId');
        const error = new Error(`project has no many-relation foreign key "chickenId", so no entity type was found`);
        expect(actual).toThrow(error);
      });

      test('option to bypass throw', () => {
        const actual = schema.getManyEntityType('chickenId', false);
        expect(actual).toEqual(undefined);
      });
    });

    describe('getEntityType', () => {
      it('can get a many-fk entity type', () => {
        const actual = schema.getEntityType('skillIds');
        expect(actual).toEqual('skill');
      });

      it('can get a one-fk entity type', () => {
        const actual = schema.getEntityType('jobId');
        expect(actual).toEqual('job');
      });

      it('throws if foreign key does not exist', () => {
        const actual = () => schema.getEntityType('chickenId');
        const error = new Error('project has no foreign key "chickenId", so no entity type was found')
        expect(actual).toThrow(error);
      });

      test('option to bypass throw', () => {
        const actual = schema.getEntityType('chickenId', false);
        expect(actual).toEqual(undefined);
      });
    });

    test('hasOne', () => {
      expect(schema.hasOne('job')).toEqual(true);
      expect(schema.hasOne('skill')).toEqual(false);
    });

    test('hasMany', () => {
      expect(schema.hasMany('skill')).toEqual(true);
      expect(schema.hasMany('job')).toEqual(false);
    });

    test('has', () => {
      expect(schema.has('skill')).toEqual(true);
      expect(schema.has('job')).toEqual(true);
      expect(schema.has('chicken')).toEqual(false);
    });
  });

  describe('Schemas', () => {
    const schemas = new Schemas(schemaDefs);

    test('getTypes', () => {
      const actual = schemas.getTypes();
      const expected = ['skill', 'project', 'job'];
      expect(actual).toEqual(expected);
    });

    test('get', () => {
      const actual = schemas.get('skill');
      const expected = new Schema(schemaDefs.skill);
      expect(actual).toEqual(expected);
    });

    test('has', () => {
      expect(schemas.has('skill')).toEqual(true);
      expect(schemas.has('chicken')).toEqual(false);
    });
  });
});