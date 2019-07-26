import { makeAdd } from './add';
import { entities } from '../mocks';
import { AddOperation, OpId } from '../interfaces';
import { OP_ADD } from '../constants';

describe('actions/add', () => {
  describe('makeAdd', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeAdd(entities, namespace);

      expect(type).toEqual('prefix/ADD');

      const actual = creator(
        ['comment', 'c1'],
        { type: 'comment', id: 'c2' },
        ['post', 'p1', { title: 'foo' }, { index: 3 }]
      );

      const expected = {
        type,
        operations: new Map<OpId, AddOperation>(Object.entries({
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            data: {},
            options: {},
            operator: OP_ADD
          },
          'comment.c2': {
            type: 'comment',
            id: 'c2',
            data: {},
            options: {},
            operator: OP_ADD
          },
          'post.p1': {
            type: 'post',
            id: 'p1',
            data: { title: 'foo' },
            options: { index: 3 },
            operator: OP_ADD
          }
        }))
      };

      expect(actual).toEqual(expected);
    });
  });
});
