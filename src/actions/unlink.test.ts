import { makeUnlink } from './unlink';
import { entities } from '../mocks';
import { CidString } from '../interfaces';
import { UnlinkDefinition as Definition } from '../interfaces';

describe('actions/unlink', () => {
  describe('makeUnlink', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeUnlink(entities, namespace);

      expect(type).toEqual('prefix/UNLINK');

      const actual = creator(
        ['comment', 'c1', 'post', 'p1'],
        { type: 'comment', id: 'c2', relation: 'postId', linkedId: 'p2' },
        { type: 'comment', id: 'c3', relation: 'postId', linkedId: 'p2' },
      );

      const expected = {
        type,
        definitions: new Map<CidString, Definition>(Object.entries({
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            relation: 'post',
            linkedId: 'p1',
          },
          'comment.c2': {
            type: 'comment',
            id: 'c2',
            relation: 'postId',
            linkedId: 'p2',
          },
          'comment.c3': {
            type: 'comment',
            id: 'c3',
            relation: 'postId',
            linkedId: 'p2',
          }
        }))
      };

      expect(actual).toEqual(expected);
    });
  });
});
