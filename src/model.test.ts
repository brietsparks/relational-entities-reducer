import { validateEntityDefs } from './model';

describe('model', () => {
  describe('validateEntityDefs', () => {
    it('accepts undefined', () => {
      validateEntityDefs();
    });

    it('accepts an empty object', () => {
      validateEntityDefs({});
    })

    it('accepts an empty object for an entityDef', () => {
      const entityDefs = {
        'skill': {}
      }

      validateEntityDefs(entityDefs);
    })

    it('throws if an entityDef is not an object', () => {
      const cases = [null, 1, true, false, 'string', undefined]

      cases.forEach(def => {
        const entityDefs = { 'skill': def }

        // @ts-ignore
        const actual = () => validateEntityDefs(entityDefs);
        const error = new Error(`the 'skill' entity definition must be an object`);

        expect(actual).toThrow(error);
      });
    })

    it('throws if entityDef .many is not an array', () => {
      const cases = [null, 1, true, false, 'string', {}];

      cases.forEach(many => {
        const entityDefs = {
          'skill': { many }
        };

        // @ts-ignore
        const actual = () => validateEntityDefs(entityDefs);
        const error = new Error("skill .many must be an array")

        expect(actual).toThrow(error);
      });
    });

    it('throws if entityDef .one is not an array', () => {
      const cases = [null, 1, true, false, 'string', {}];

      cases.forEach(one => {
        const entityDefs = {
          'skill': { one }
        };

        // @ts-ignore
        const actual = () => validateEntityDefs(entityDefs);
        const error = new Error("skill .one must be an array")

        expect(actual).toThrow(error);
      });
    });

    it('throws if an item in .many is not a key in the entityDefs object', () => {
      const entityDefs = {
        'project': {
          many: ['skill', 'chicken']
        },
        'skill': {
          many: ['project']
        },
      };

      const actual = () => validateEntityDefs(entityDefs);
      const error = new Error('project contains .many.chicken, but chicken is not defined as an entity')

      expect(actual).toThrow(error);
    });

    it('throws if an item in .one is not a key in the entityDefs object', () => {
      const entityDefs = {
        'project': {
          one: ['organization', 'chicken']
        },
        'organization': {
          many: ['project']
        },
      };

      const actual = () => validateEntityDefs(entityDefs);
      const error = new Error('project contains .one.chicken, but chicken is not defined as an entity')

      expect(actual).toThrow(error);
    });

    it('throws if an item is in both .one and .many', () => {
      const entityDefs = {
        'project': {
          many: ['skill'],
          one: ['skill']
        },
        'skill': {
          many: ['project']
        }
      };

      const actual = () => validateEntityDefs(entityDefs);
      const error = new Error('project cannot have skill as both a .many and .one relation');

      expect(actual).toThrow(error);
    })
  })
})
