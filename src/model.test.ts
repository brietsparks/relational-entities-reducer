import { validateModelDef, InvalidModelDefinition } from './model';

const nonObjects = [null, 1, true, false, 'string', undefined];
const nonStrings = [null, 1, true, false, undefined, [], {}];

describe('model', () => {
  describe('validateModelDef', () => {
    it('throws if not given an object', () => {
      nonObjects.forEach(nonObject => {
        // @ts-ignore
        const actual = () => validateModelDef(nonObject);
        const error = new InvalidModelDefinition('model definition must be an object');

        expect(actual).toThrow(error);
      });
    });

    it(`throws if entity relations is not an object`, () => {
      nonObjects.forEach(nonObject => {
        const modelDef = {
          post: nonObject
        };

        // @ts-ignore
        const actual = () => validateModelDef(modelDef);
        const error = new InvalidModelDefinition('.post must be an object');
        expect(actual).toThrow(error);
      })
    });

    it('throws if an entity relation is not an object', () => {
      nonObjects.forEach(nonObject => {
        const modelDef = {
          post: {
            'commentIds': nonObject
          }
        };

        // @ts-ignore
        const actual = () => validateModelDef(modelDef);
        const error = new InvalidModelDefinition('.post.commentIds must be an object');
        expect(actual).toThrow(error);
      });
    });

    it('throws if an entity relation is not either "many" or "one"', () => {
      ['foo', ...nonStrings].forEach(nonString => {
        const modelDef = {
          post: {
            'commentIds': {
              has: nonString,
              type: 'comment'
            }
          }
        };

        // @ts-ignore
        const actual = () => validateModelDef(modelDef);
        const error = new InvalidModelDefinition('.post.commentIds.has must be either "many" or "one"');
        expect(actual).toThrow(error);
      });
    });

    it('throws if an entity relation .type is not a string', () => {
      nonStrings.forEach(nonString => {
        const modelDef = {
          post: {
            'commentIds': {
              has: 'many',
              type: nonString
            }
          }
        };

        // @ts-ignore
        const actual = () => validateModelDef(modelDef);
        const error = new InvalidModelDefinition('.post.commentIds.type must be a string');
        expect(actual).toThrow(error);
      });
    });

    it('throws if a foreign entity type is not defined as an entity', () => {
      const modelDef = {
        post: {
          'commentIds': {
            has: 'many',
            type: 'comment'
          }
        }
      };

      // @ts-ignore
      const actual = () => validateModelDef(modelDef);
      const error = new InvalidModelDefinition('.post.commentIds.type "comment" is invalid because comment is not defined as an entity');
      expect(actual).toThrow(error);
    });

    it('throws if a foreign entity does not have a reciprocal relation defined', () => {
      const modelDef = {
        post: {
          'commentIds': {
            has: 'many',
            type: 'comment'
          }
        },
        comment: {}
      };

      // @ts-ignore
      const actual = () => validateModelDef(modelDef);
      const error = new InvalidModelDefinition('.post.commentIds.type "comment" is invalid because comment does not have a reciprocal relation for post');
      expect(actual).toThrow(error);
    });
  });
});
