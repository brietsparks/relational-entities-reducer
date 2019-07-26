import { makeReindex } from './reindex';
import { entities } from '../mocks';

describe('actions/reindex', () => {
  describe('makeReindex', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeReindex(entities, namespace);

      expect(type).toEqual('prefix/REINDEX');

      const actual = creator('comment', 1, 3);

      const expected = {
        type,
        resourceType: 'comment',
        source: 1,
        destination: 3
      };

      expect(actual).toEqual(expected);
    });
  });
});
