import { makeRemove } from './remove';
import { entities } from '../mocks';
import { RemoveOperation, OpId } from '../interfaces';
import { OP_REMOVE } from '../constants';

describe('actions/remove', () => {
  describe('makeRemove', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeRemove(entities, namespace);

      expect(type).toEqual('prefix/REMOVE');

      const actual = creator(
        ['comment', 'c1'],
        { type: 'comment', id: 'c2', options: {}},
        ['post', 'p1', {}]
      );

      const expected = {
        type,
        operations: new Map<OpId, RemoveOperation>(Object.entries({
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            data: {},
            options: {},
            operator: OP_REMOVE
          },
          'comment.c2': {
            type: 'comment',
            id: 'c2',
            data: {},
            options: {},
            operator: OP_REMOVE
          },
          'post.p1': {
            type: 'post',
            id: 'p1',
            data: {},
            options: {},
            operator: OP_REMOVE
          }
        }))
      };

      expect(actual).toEqual(expected);
    });
  });
});
