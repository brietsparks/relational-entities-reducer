import { makeReindexRelated } from './reindex-related';
import { entities } from '../mocks';

describe('actions/reindex-related', () => {
  describe('makeReindexRelated', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeReindexRelated(entities, namespace);

      const actual = creator('comment', 'c1', 'post', 1, 3);

      const expected = {
        type,
        resourceType: 'comment',
        resourceId: 'c1',
        relation: 'post',
        source: 1,
        destination: 3
      };

      expect(actual).toEqual(expected);
    });
  });
});
