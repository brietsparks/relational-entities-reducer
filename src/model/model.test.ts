import { Entity, Model } from './model';
import { ModelSchema } from './schema';
import { modelSchema } from '../mocks';
import { MANY, ONE } from './resource';

describe('model/model', () => {
  describe('Model', () => {
    describe('getEntity', () => {
      const schema: ModelSchema = { 'comment': {} };
      const model = new Model(schema);

      it('throws if entity does not exist', () => {
        const actual = () => model.getEntity('chicken');
        const error = new Error('model does not have an entity of type "chicken"');
        expect(actual).toThrow(error);
      });

      it('returns a valid entity', () => {
        const actual = model.getEntity('comment');
        const expected = new Entity('comment', schema['comment'], model);
        expect(actual).toEqual(expected);
      });
    });

    test('getEntities', () => {
      const model = new Model({ 'comment': {}, 'post': {} });
      const actual = model.getEntityTypes();
      const expected = ['comment', 'post'];
      expect(actual).toEqual(expected);
    });

    test('getEmptyState', () => {
      const model = new Model({ 'comment': {}, 'post': {} });

      let actual, expected;
      actual = model.getEmptyState();
      expected = {
        comment: {
          resources: {},
          ids: []
        },
        post: {
          resources: {},
          ids: []
        }
      };

      expect(actual).toEqual(expected);
    });

    test('getEmptyCollectionState', () => {
      const actual = Model.getEmptyCollectionState();
      const expected = {
        resources: {},
        ids: []
      };
      expect(actual).toEqual(expected);
    });

    test('getEmptyResourcesState', () => {
      const actual = Model.getEmptyResourcesState();
      expect(actual).toEqual({});
    });

    test('getEmptyIdsState', () => {
      const actual = Model.getEmptyIdsState();
      expect(actual).toEqual([]);
    });
  });

  describe('Entity', () => {
    const model = new Model(modelSchema);

    test('hasFk', () => {
      let actual;

      actual = model.getEntity('post').hasFk('commentIds');
      expect(actual).toEqual(true);

      actual = model.getEntity('post').hasFk('chickenIds');
      expect(actual).toEqual(false);
    });

    describe('isManyFk', () => {
      it('returns whether a valid fk is a many-relation', () => {
        let actual;

        actual = model.getEntity('post').isManyFk('commentIds');
        expect(actual).toEqual(true);

        actual = model.getEntity('post').isManyFk('authorId');
        expect(actual).toEqual(false);
      });

      it('throws if given invalid fk', () => {
        const actual = () => model.getEntity('post').isManyFk('chickenIds');
        const error = new Error('entity "post" has no fk "chickenIds"');
        expect(actual).toThrow(error);
      });
    });

    describe('isOneFk', () => {
      it('returns whether a valid fk is a many-relation', () => {
        let actual;

        actual = model.getEntity('post').isOneFk('authorId');
        expect(actual).toEqual(true);

        actual = model.getEntity('post').isOneFk('commentIds');
        expect(actual).toEqual(false);
      });

      it('throws if given invalid fk', () => {
        const actual = () => model.getEntity('post').isOneFk('chickenIds');
        const error = new Error('entity "post" has no fk "chickenIds"');
        expect(actual).toThrow(error);
      });
    });

    test('getFksMany', () => {
      const actual = model.getEntity('user').getFksMany();
      const expected = [
        'authoredPostIds',
        'editablePostIds',
        'commentIds',
        'permissionIds',
      ];
      expect(actual).toEqual(expected);
    });

    describe('getFksByType', () => {
      it(`returns an array of fk's for the related type`, () => {
        const entity = model.getEntity('post');

        let actual, expected;

        actual = entity.getFksByType('user');
        expected = ['authorId', 'editorIds'];
        expect(actual).toEqual(expected);

        actual = entity.getFksByType('comment');
        expected = ['commentIds'];
        expect(actual).toEqual(expected);
      });

      it('thows if no types exist for an fk', () => {
        const entity = model.getEntity('post');
        const actual = () => entity.getFksByType('chicken');
        const error = new Error('entity "post" does not have a relation to entity "chicken"');

        expect(actual).toThrow(error);
      });
    });

    describe('getTypeByFk', () => {
      it('returns a related type by its fk', () => {
        const entity = model.getEntity('post');

        let actual;

        actual = entity.getTypeByFk('authorId');
        expect(actual).toEqual('user');

        actual = entity.getTypeByFk('editorIds');
        expect(actual).toEqual('user');

        actual = entity.getTypeByFk('commentIds');
        expect(actual).toEqual('comment');
      });

      it('throws if the fk does not exist', () => {
        const entity = model.getEntity('post');

        const actual = () => entity.getTypeByFk('chickenId');
        const error = new Error('entity "post" has no fk "chickenId"');

        expect(actual).toThrow(error);
      });
    });

    describe('getEntityByFk', () => {
      it('return a related entity given its fk', () => {
        const entity = model.getEntity('post');

        const actual = entity.getEntityByFk('editorIds');
        const expected = model.getEntity('user');

        expect(actual).toEqual(expected);
      });

      it('throws if the fk does not exist', () => {
        const entity = model.getEntity('post');

        const actual = () => entity.getEntityByFk('chickenId');
        const error = new Error('entity "post" has no fk "chickenId"');

        expect(actual).toThrow(error);
      });
    });

    describe('getCardinalityByFk', () => {
      it('returns cardinality of an fk with respect to a related entity', () => {
        const entity = model.getEntity('post');

        let actual;

        actual = entity.getCardinalityByFk('authorId');
        expect(actual).toEqual(ONE);

        actual = entity.getCardinalityByFk('editorIds');
        expect(actual).toEqual(MANY);

        actual = entity.getCardinalityByFk('commentIds');
        expect(actual).toEqual(MANY);
      });

      it('throws if given a value that is not an fk', () => {
        const entity = model.getEntity('post');

        const actual = () => entity.getCardinalityByFk('chickenId');
        const error = new Error('entity "post" has no fk "chickenId"');

        expect(actual).toThrow(error);
      });
    });

    describe('getReciprocalKeyByFk', () => {
      it('returns a reciprocal key by fk', () => {
        const entity = model.getEntity('post');
        let actual;

        actual = entity.getReciprocalKeyByFk('authorId');
        expect(actual).toEqual('authoredPostIds');

        actual = entity.getReciprocalKeyByFk('editorIds');
        expect(actual).toEqual('editablePostIds');

        actual = entity.getReciprocalKeyByFk('commentIds');
        expect(actual).toEqual('postId');
      });

      it('throws if the entity does not have the fk', () => {
        const entity = model.getEntity('post');

        const actual = () => entity.getReciprocalKeyByFk('chickenId');
        const error = new Error('entity "post" has no fk "chickenId"');

        expect(actual).toThrow(error);
      });
    });

    describe('extractRelatedPointersOne', () => {
      it('extracts related for one-cardinality', () => {
        const actual = model.getEntity('comment').extractRelatedPointersOne({
          userId: 'u1',           // one
          postId: 'p1',           // one
          parentId: 'c1',         // one
          childIds: ['c3', 'c4']  // many
        });

        const expected = [
          { relatedType: 'user', relatedId: 'u1', reciprocalFk: 'commentIds', reciprocalCardinality: 'many' },
          { relatedType: 'post', relatedId: 'p1', reciprocalFk: 'commentIds', reciprocalCardinality: 'many' },
          { relatedType: 'comment', relatedId: 'c1', reciprocalFk: 'childIds', reciprocalCardinality: 'many' },
        ];

        expect(actual).toEqual(expected);
      });
    });

    describe('extractRelatedPointersMany', () => {
      test('with empty data', () => {
        const actual = model.getEntity('comment').extractRelatedPointersMany({});
        expect(actual).toEqual([]);
      });

      it('extracts related for many-cardinality', () => {
        const actual = model.getEntity('comment').extractRelatedPointersMany({
          userId: 'u1',           // one
          postId: 'p1',           // one
          parentId: 'c1',         // one
          childIds: ['c3', 'c4']  // many
        });

        const expected = [
          { relatedType: 'comment', relatedId: 'c3', reciprocalFk: 'parentId', reciprocalCardinality: 'one' },
          { relatedType: 'comment', relatedId: 'c4', reciprocalFk: 'parentId', reciprocalCardinality: 'one' },
        ];

        expect(actual).toEqual(expected);
      });
    });

    describe('extractRelatedPointers', () => {
      test('with empty data', () => {
        const actual = model.getEntity('comment').extractRelatedPointers({});
        expect(actual).toEqual([]);
      });

      it('extracts related', () => {
        const actual = model.getEntity('comment').extractRelatedPointers({
          userId: 'u1',           // one
          postId: 'p1',           // one
          parentId: 'c1',         // one
          childIds: ['c3', 'c4']  // many
        });

        const expected = [
          { relatedType: 'user', relatedId: 'u1', reciprocalFk: 'commentIds', reciprocalCardinality: 'many' },
          { relatedType: 'post', relatedId: 'p1', reciprocalFk: 'commentIds', reciprocalCardinality: 'many' },
          { relatedType: 'comment', relatedId: 'c1', reciprocalFk: 'childIds', reciprocalCardinality: 'many' },
          { relatedType: 'comment', relatedId: 'c3', reciprocalFk: 'parentId', reciprocalCardinality: 'one' },
          { relatedType: 'comment', relatedId: 'c4', reciprocalFk: 'parentId', reciprocalCardinality: 'one' },
        ];

        expect(actual).toEqual(expected);
      });
    });
  });
});
