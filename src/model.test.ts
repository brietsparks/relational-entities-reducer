import Model from './model';
import { Entities, Entity } from './schema';
import { schema, selectors } from './mocks';

describe('model', () => {
  const entities = new Entities(schema);

  describe('extractAllLinks', () => {
    test('empty data', () => {
      const model = new Model(entities, selectors, {});
      const actual = model.extractAllLinks('post', {});
      expect(actual).toEqual([]);
    });

    test('with data', () => {
      const model = new Model(entities, selectors, {});

      const data = {
        authorId: 'a1',
        editorIds: ['a2', 'a3'],
        commentIds: ['c1', 'c2']
      };

      const actual = model.extractAllLinks('post', data);

      const expected = [
        {
          relatedType: 'user',
          linkedId: 'a2',
          relationKey: 'editorIds',
          relationName: 'editor',
          index: 0,
        },
        {
          relatedType: 'user',
          linkedId: 'a3',
          relationKey: 'editorIds',
          relationName: 'editor',
          index: 1,
        },
        {
          relatedType: 'comment',
          linkedId: 'c1',
          relationKey: 'commentIds',
          relationName: 'comment',
          index: 0,
        },
        {
          relatedType: 'comment',
          linkedId: 'c2',
          relationKey: 'commentIds',
          relationName: 'comment',
          index: 1,
        },
        {
          relatedType: 'user',
          linkedId: 'a1',
          relationKey: 'authorId',
          relationName: 'author'
        }
      ];

      expect(actual).toEqual(expected);
    });
  });

  describe('passthroughs', () => {

    test('getResource', () => {
      const state = {
        'post': {
          resources: { 'p1': { commentIds: [] } },
          ids: ['p1']
        },
      };

      const model = new Model(entities, selectors, state);
      const actual = model.getResource('post', 'p1');
      const expected = { commentIds: [] };
      expect(actual).toEqual(expected);
    });

    test('hasResource', () => {
      const state = {
        'post': {
          resources: { 'p1': { commentIds: [] } },
          ids: ['p1']
        },
      };

      const model = new Model(entities, selectors, state);

      let actual;
      actual = model.hasResource('post', 'p1');
      expect(actual).toEqual(true);

      actual = model.hasResource('post', 'p1000');
      expect(actual).toEqual(false);
    });

    test('getEntity', () => {
      const model = new Model(entities, selectors, {});
      const actual = model.getEntity('post');
      const expected = new Entity('post', schema['post'], entities);
      expect(actual).toEqual(expected);
    });

    test('getRelationKey', () => {
      const model = new Model(entities, selectors, {});
      const actual = model.getRelationKey('post', 'editor');
      expect(actual).toEqual('editorIds');
    });
  });
});
