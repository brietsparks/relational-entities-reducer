import { Entities, Entity } from './entities';
import { schema } from '../mocks';

describe('schema/entities', () => {
  const entities = new Entities(schema);

  describe('Entities', () => {
    describe('getEntity', () => {
      it('returns an existing entity', () => {
        const actual = entities.getEntity('post');
        const expected = new Entity('post', schema['post'], entities);

        expect(actual).toEqual(expected);
      });
    });

    test('getTypes', () => {
      const actual = entities.getTypes();
      const expected = ['user', 'post', 'comment', 'profile', 'permission'];
      expect(actual).toEqual(expected);
    });

    test('getEmptyState', () => {
      const actual = entities.getEmptyState();
      const expected = {
        user: { resources: {}, ids: [] },
        post: { resources: {}, ids: [] },
        comment: { resources: {}, ids: [] },
        profile: { resources: {}, ids: [] },
        permission: { resources: {}, ids: [] },
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('Entity', () => {
    const postEntity = new Entity('post', schema['post'], entities);

    test('getManyRelationKeys', () => {
      const actual = postEntity.getManyRelationKeys();
      const expected = ['editorIds', 'commentIds'];
      expect(actual).toEqual(expected);
    });

    test('getOneRelationKeys', () => {
      const actual = postEntity.getOneRelationKeys();
      const expected = ['authorId'];
      expect(actual).toEqual(expected);
    });

    test('hasRelationKey', () => {
      let actual;
      actual = postEntity.hasRelationKey('commentIds');
      expect(actual).toEqual(true);

      actual = postEntity.hasRelationKey('comment');
      expect(actual).toEqual(false);

      actual = postEntity.hasRelationKey('permissionIds');
      expect(actual).toEqual(false);
    });

    describe('getRelationKey', () => {
      it('returns the relationKey if given a valid relationKey', () => {
        const actual = postEntity.getRelationKey('commentIds');
        expect(actual).toEqual('commentIds');
      });

      it('returns the relationKey if given a valid relation name', () => {
        const actual = postEntity.getRelationKey('comment');
        expect(actual).toEqual('commentIds');
      });

      it('throws if given a relation name that requires an alias', () => {
        const actual = () => postEntity.getRelationKey('user');
        const error = new Error('for entity "post", cannot get relationKey for relation "user" because more than one key points to that that entity. Try getting the key by its entity alias');
        expect(actual).toThrow(error);
      });

      it('returns the relationKey if given a valid relation name alias', () => {
        const actual = postEntity.getRelationKey('editor');
        expect(actual).toEqual('editorIds');
      });

      it('throws if no relation exists with that relation key, name, or alias', () => {
        const actual = () => postEntity.getRelationKey('chicken');
        const error = new Error('entity "post" does not contain a relation with the name or key "chicken"');
        expect(actual).toThrow(error);
      });
    });

    describe('getReciprocalKey', () => {
      test('explicit', () => {
        const actual = postEntity.getReciprocalKey('authorId');
        expect(actual).toEqual('authoredPostIds');
      });

      test('implicit', () => {
        const actual = postEntity.getReciprocalKey('commentIds');
        expect(actual).toEqual('postId');
      });
    });

    describe('getRelationDefinition', () => {
      test('case 1', () => {
        const actual = postEntity.getRelationDefinition('authorId');
        const expected = {
          type: 'post',
          relationKey: 'authorId',
          relatedType: 'user',
          cardinality: 'one',
          relationName: 'author',
          reciprocalKey: 'authoredPostIds',
          reciprocalCardinality: 'many'
        };
        expect(actual).toEqual(expected);
      });

      test('case 2', () => {
        const actual = postEntity.getRelationDefinition('commentIds');
        const expected = {
          type: 'post',
          relationKey: 'commentIds',
          relatedType: 'comment',
          cardinality: 'many',
          relationName: 'comment',
          reciprocalKey: 'postId',
          reciprocalCardinality: 'one'
        };
        expect(actual).toEqual(expected);
      });
    });

    test('getManyRelationDefinitions', () => {
      const actual = postEntity.getManyRelationDefinitions();

      const expected = [
        {
          type: 'post',
          relationKey: 'editorIds',
          relatedType: 'user',
          cardinality: 'many',
          relationName: 'editor',
          reciprocalKey: 'editablePostIds',
          reciprocalCardinality: 'many'
        },
        {
          type: 'post',
          relationKey: 'commentIds',
          relatedType: 'comment',
          cardinality: 'many',
          relationName: 'comment',
          reciprocalKey: 'postId',
          reciprocalCardinality: 'one'
        }
      ];

      expect(actual).toEqual(expected);
    });

    test('getOneRelationDefinitions', () => {
      const actual = postEntity.getOneRelationDefinitions();

      const expected = [
        {
          type: 'post',
          relationKey: 'authorId',
          relatedType: 'user',
          cardinality: 'one',
          relationName: 'author',
          reciprocalKey: 'authoredPostIds',
          reciprocalCardinality: 'many'
        }
      ];

      expect(actual).toEqual(expected);
    });
  });
});
