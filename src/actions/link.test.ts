import { makeLink } from './link';
import { entities } from '../mocks';
import { CidString } from '../interfaces';
import { LinkDefinition as Definition } from '../interfaces';

describe('actions/link', () => {
  describe('makeLink', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeLink(entities, namespace);

      expect(type).toEqual('prefix/LINK');

      const actual = creator(
        ['comment', 'c1', 'post', 'p1', []],
        { type: 'comment', id: 'c2', relation: 'postId', linkedId: 'p2', indices: [] },
        { type: 'comment', id: 'c3', relation: 'postId', linkedId: 'p2', indices: [2, 3] },
      );

      const expected = {
        type,
        definitions: new Map<CidString, Definition>(Object.entries({
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            relation: 'post',
            linkedId: 'p1',
            indices: []
          },
          'comment.c2': {
            type: 'comment',
            id: 'c2',
            relation: 'postId',
            linkedId: 'p2',
            indices: []
          },
          'comment.c3': {
            type: 'comment',
            id: 'c3',
            relation: 'postId',
            linkedId: 'p2',
            indices: [2, 3]
          }
        }))
      };

      expect(actual).toEqual(expected);
    });
  });
});
