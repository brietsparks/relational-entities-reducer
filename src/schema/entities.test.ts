import { Entities, Entity } from './entities';
import { schema } from '../mocks';

describe('schema/entities', () => {
  describe('Entities', () => {
    describe('getEntity', () => {
      it('returns an existing entity', () => {
        const entities = new Entities(schema);

        const actual = entities.getEntity('post');
        const expected = new Entity('post', schema['post']);

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('Entity', () => {
    test('hasRelationKey', () => {
      const entity = new Entity('post', schema['post']);

      let actual;
      actual = entity.hasRelationKey('commentIds');
      expect(actual).toEqual(true);

      actual = entity.hasRelationKey('comment');
      expect(actual).toEqual(false);

      actual = entity.hasRelationKey('permissionIds');
      expect(actual).toEqual(false);
    });

    describe('getRelationKey', () => {
      const entity = new Entity('post', schema['post']);

      it('returns the relationKey if given a valid relationKey', () => {
        const actual = entity.getRelationKey('commentIds');
        expect(actual).toEqual('commentIds');
      });

      it('returns the relationKey if given a valid relation name', () => {
        const actual = entity.getRelationKey('comment');
        expect(actual).toEqual('commentIds');
      });

      it('throws if given a relation name that requires an alias', () => {
        const actual = () => entity.getRelationKey('user');
        const error = new Error('for entity "post", cannot get relationKey for relation "user" because more than one key points to that that entity. Try getting the key by its entity alias');
        expect(actual).toThrow(error);
      });

      it('returns the relationKey if given a valid relation name alias', () => {
        const actual = entity.getRelationKey('editor');
        expect(actual).toEqual('editorIds');
      });

      it('throws if no relation exists with that relation key, name, or alias', () => {
        const actual = () => entity.getRelationKey('chicken');
        const error = new Error('entity "post" does not contain a relation with the name or key "chicken"');
        expect(actual).toThrow(error);
      });
    });
  });

});
