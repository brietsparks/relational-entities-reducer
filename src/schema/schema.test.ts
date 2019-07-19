import { validateSchema, InvalidSchema, Schema, ReciprocalKeyValidator } from './schema';
import { nonStrings, nonObjects, schema as mockSchema } from '../mocks';

describe('model/schema', () => {
  describe('validateSchema', () => {
    test('with valid schema', () => {
      validateSchema(mockSchema);
    });

    it('throws if not given an object', () => {
      nonObjects.forEach(nonObject => {
        // @ts-ignore
        const actual = () => validateSchema(nonObject);
        const error = new InvalidSchema('schema must be an object');

        expect(actual).toThrow(error);
      });
    });

    it(`throws if an entity schema is not an object`, () => {
      nonObjects.forEach(nonObject => {
        const schema = {
          post: nonObject
        };

        // @ts-ignore
        const actual = () => validateSchema(schema);
        const error = new InvalidSchema('.post must be an object');
        expect(actual).toThrow(error);
      })
    });

    it('throws if an entity schema relation is not an object', () => {
      nonObjects.forEach(nonObject => {
        const schema = {
          post: {
            'commentIds': nonObject
          }
        };

        // @ts-ignore
        const actual = () => validateSchema(schema);
        const error = new InvalidSchema('.post.commentIds must be an object');
        expect(actual).toThrow(error);
      });
    });

    it('throws if an entity schema relation .has is not either "many" or "one"', () => {
      ['foo', ...nonStrings].forEach(nonString => {
        const schema = {
          post: {
            'commentIds': {
              has: nonString,
              type: 'comment'
            }
          }
        };

        // @ts-ignore
        const actual = () => validateSchema(schema);
        const error = new InvalidSchema('.post.commentIds.has must be either "many" or "one"');
        expect(actual).toThrow(error);
      });
    });

    it('throws if an entity schema relation .type is not a string', () => {
      nonStrings.forEach(nonString => {
        const schema = {
          post: {
            'commentIds': {
              has: 'many',
              type: nonString
            }
          }
        };

        // @ts-ignore
        const actual = () => validateSchema(schema);
        const error = new InvalidSchema('.post.commentIds.type must be a string');
        expect(actual).toThrow(error);
      });
    });

    it('throws if a related entity type is not defined as an entity', () => {
      const schema: Schema = {
        post: {
          'commentIds': {
            has: 'many',
            type: 'comment'
          }
        }
      };

      const actual = () => validateSchema(schema);
      const error = new InvalidSchema('.post.commentIds.type "comment" is invalid because comment is not defined as an entity');
      expect(actual).toThrow(error);
    });

    it('throws if a related entity does not have a reciprocal relation defined', () => {
      const schema: Schema = {
        post: {
          'commentIds': {
            has: 'many',
            type: 'comment'
          }
        },
        comment: {}
      };

      const actual = () => validateSchema(schema);
      const error = new InvalidSchema('.post.commentIds.type "comment" is invalid because comment does not have a reciprocal relation for post');
      expect(actual).toThrow(error);
    });

    describe('throws if multiple related keys that point to the same entity do not have a corresponding reciprocalKey', () => {
      test('other-referencing', () => {
        const schema: Schema = {
          'post': {
            'authorId': {
              has: 'one',
              type: 'user',
              reciprocalKey: 'authoredPostIds'
            },
            'editorIds': {
              has: 'many',
              type: 'user'
            }
          },
          'user': {
            'authoredPostIds': {
              has: 'many',
              type: 'post',
              reciprocalKey: 'authorId'
            },
            'editorPostIds': {
              has: 'many',
              type: 'post'
            }
          }
        };

        const actual = () => validateSchema(schema);
        const error = new InvalidSchema('.post.editorIds requires .reciprocalKey to specify which user attribute points back to .post.editorIds');
        expect(actual).toThrow(error);
      });

      test('self-referencing', () => {
        const schema: Schema = {
          'comment': {
            'childIds': {
              has: 'many',
              type: 'comment'
            },
            'parentId': {
              has: 'one',
              type: 'comment'
            }
          }
        };

        const error = new InvalidSchema('.comment.childIds requires .reciprocalKey to specify which comment attribute points back to .comment.childIds');
        const actual = () => validateSchema(schema);
        expect(actual).toThrow(error);
      });
    });

    test('valid schema', () => {
      const schema: Schema = {
        'post': {
          'authorId': {
            has: 'one',
            type: 'user',
            reciprocalKey: 'authoredPostIds'
          },
          'editorIds': {
            has: 'many',
            type: 'user',
            reciprocalKey: 'editorPostIds'
          }
        },
        'user': {
          'authoredPostIds': {
            has: 'many',
            type: 'post',
            reciprocalKey: 'authorId'
          },
          'editorPostIds': {
            has: 'many',
            type: 'post',
            reciprocalKey: 'editorIds'
          }
        }
      };

      validateSchema(schema);
    });

    test('valid schema, self referencing entity', () => {
      const schema: Schema = {
        'comment': {
          'childIds': {
            has: 'many',
            type: 'comment',
            reciprocalKey: 'parentId'
          },
          'parentId': {
            has: 'one',
            type: 'comment',
            reciprocalKey: 'childIds'
          }
        },
      };

      validateSchema(schema);
    });
  });

  describe('ReciprocalKeyValidator', () => {
    it('does not throw if only one related key points to a related entity', () => {
      const validator = new ReciprocalKeyValidator('post');
      validator.addRelationKey('user', 'authorId');
      validator.validate({});
    });

    it('throws if reciprocal key is undefined', () => {
      const validator = new ReciprocalKeyValidator('post');

      validator.addRelationKey('user', 'editorIds');
      validator.addRelationKey('user', 'authorId');

      const actual = () => validator.validate({});
      const error = new Error('.post.editorIds requires .reciprocalKey to specify which user attribute points back to .post.editorIds');

      expect(actual).toThrow(error);
    });

    it('throws if reciprocal key is the wrong value', () => {
      const validator = new ReciprocalKeyValidator('post');

      validator.addRelationKey('user', 'authorId', 'authoredPostIds');
      validator.addRelationKey('user', 'editorIds', 'incorrectKey');

      const schema: Schema = {
        'post': {
          'authorId': {
            has: 'one',
            type: 'user',
            reciprocalKey: 'authoredPostIds'
          },
          'editorIds': {
            has: 'many',
            type: 'user',
            reciprocalKey: 'incorrectKey' // the correct value would be 'editorPostIds'
          }
        },
        'user': {
          'authoredPostIds': {
            has: 'many',
            type: 'post',
            reciprocalKey: 'authorId'
          },
          'editorPostIds': {
            has: 'many',
            type: 'post',
            reciprocalKey: 'editorIds'
          }
        }
      };

      const actual = () => validator.validate(schema);
      const error = new Error('.post.editorIds requires .reciprocalKey to specify which user attribute points back to .post.editorIds');

      expect(actual).toThrow(error);
    });

    test('with valid schema', () => {
      const validator = new ReciprocalKeyValidator('post');

      validator.addRelationKey('user', 'authorId', 'authoredPostIds');
      validator.addRelationKey('user', 'editorIds', 'editorPostIds');

      const schema: Schema = {
        'post': {
          'authorId': {
            has: 'one',
            type: 'user',
            reciprocalKey: 'authoredPostIds'
          },
          'editorIds': {
            has: 'many',
            type: 'user',
            reciprocalKey: 'editorPostIds'
          }
        },
        'user': {
          'authoredPostIds': {
            has: 'many',
            type: 'post',
            reciprocalKey: 'authorId'
          },
          'editorPostIds': {
            has: 'many',
            type: 'post',
            reciprocalKey: 'editorIds'
          }
        }
      };

      validator.validate(schema);
    });
  });
});


