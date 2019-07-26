import groupByType from './group-by-type';
import { Operation, OpId } from '../interfaces';
import { OP_ADD, OP_EDIT } from '../constants';

describe('transformers/group-by-type', () => {
  describe('groupByType', () => {
    it('groups operations by their type', () => {
      const operations = new Map<OpId, Operation>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          operator: OP_ADD,
          data: {},
        },
        'post.p1': {
          type: 'post',
          id: 'p1',
          operator: OP_EDIT,
          data: {},
        },
        'comment.c2': {
          type: 'comment',
          id: 'c2',
          operator: OP_EDIT,
          data: {},
        }
      }));

      const actual = groupByType(operations);

      const expected = {
        'comment': new Map<OpId, Operation>(Object.entries({
          'c1': {
            type: 'comment',
            id: 'c1',
            operator: OP_ADD,
            data: {},
          },
          'c2': {
            type: 'comment',
            id: 'c2',
            operator: OP_EDIT,
            data: {},
          }
        })),
        'post': new Map<OpId, Operation>(Object.entries({
          'p1': {
            type: 'post',
            id: 'p1',
            operator: OP_EDIT,
            data: {},
          },
        }))
      };

      expect(actual).toEqual(expected);
    });
  });
});
