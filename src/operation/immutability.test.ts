import { setManyRelationId, setOneRelationId, removeManyRelationId } from './immutability';
import { nonArrays } from '../mocks';

describe('operation/immutability', () => {
  test('setOneRelationId', () => {
    const data = { text: 'foo' };
    const actual = setOneRelationId(data, 'postId', 'p1');
    const expected = { text: 'foo', postId: 'p1' };

    expect(actual).toEqual(expected);
    expect(actual).not.toBe(data);
  });

  describe('setManyRelationId', () => {
    it('can append an id', () => {
      const data = { commentIds: ['c1', 'c2'] };
      const actual = setManyRelationId(data, 'commentIds', 'c3');
      const expected = { commentIds: ['c1', 'c2', 'c3'] };

      expect(actual).toEqual(expected);
      expect(actual).not.toBe(data);
      expect(actual.commentIds).not.toBe(data.commentIds);
    });

    it('it can insert an id', () => {
      const data = { commentIds: ['c1', 'c2'] };
      const actual = setManyRelationId(data, 'commentIds', 'c3', 1);
      const expected = { commentIds: ['c1', 'c3', 'c2'] };

      expect(actual).toEqual(expected);
      expect(actual).not.toBe(data);
      expect(actual.commentIds).not.toBe(data.commentIds);
    });

    it('can initialize ids', () => {
      const data = {};
      const actual = setManyRelationId(data, 'commentIds', 'c1');
      const expected = { commentIds: ['c1'] };

      expect(actual).toEqual(expected);
      expect(actual).not.toBe(data);
    });

    it('does not add existing ids', () => {
      const data = { commentIds: ['c1', 'c2', 'c3'] };
      const actual = setManyRelationId(data, 'commentIds', 'c2');
      expect(actual).toEqual(data);
      expect(actual.commentIds).not.toBe(data.commentIds);
    });
  });

  describe('removeManyRelationId', () => {
    const data = { commentIds: ['c1', 'c2', 'c3'] };
    const expected = { commentIds: ['c1', 'c3'] };

    test('remove by index', () => {
      const actual = removeManyRelationId(data, 'commentIds', 1);
      expect(actual).toEqual(expected);
      expect(actual.commentIds).not.toBe(data.commentIds);
    });

    test('remove by id', () => {
      const actual = removeManyRelationId(data, 'commentIds', 'c2', true);
      expect(actual).toEqual(expected);
      expect(actual.commentIds).not.toBe(data.commentIds);
    });

    it('throws if relation data is not an array', () => {
      nonArrays.forEach(invalidRelationData => {
        const data = { commentIds: invalidRelationData };
        const actual = () => removeManyRelationId(data, 'commentIds', 1);
        const error = new Error('expected relationKey "commentIds" to be an array');
        expect(actual).toThrow(error);
      });
    });
  });
});
