import { makeEdit } from './edit';
import { entities } from '../mocks';
import { EditOperation, OpId } from '../interfaces';
import { OP_EDIT } from '../constants';

describe('actions/edit', () => {
  describe('makeEdit', () => {
    it('returns an action type and creator', () => {
      const namespace = (type: string) => `prefix/${type}`;

      const { type, creator } = makeEdit(entities, namespace);

      expect(type).toEqual('prefix/EDIT');

      const actual = creator(
        ['comment', 'c1', {}],
        { type: 'comment', id: 'c2', data: {} },
        ['post', 'p1', { title: 'foo' }, { index: 3 }]
      );

      const expected = {
        type,
        operations: new Map<OpId, EditOperation>(Object.entries({
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            data: {},
            options: {},
            operator: OP_EDIT
          },
          'comment.c2': {
            type: 'comment',
            id: 'c2',
            data: {},
            options: {},
            operator: OP_EDIT
          },
          'post.p1': {
            type: 'post',
            id: 'p1',
            data: { title: 'foo' },
            options: { index: 3 },
            operator: OP_EDIT
          }
        }))
      };

      expect(actual).toEqual(expected);
    });
  });
});
