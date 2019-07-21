import Repository, { OP_ADD, OP_EDIT } from './repository';
import Model from '../model';
import { selectors, entities } from '../mocks';
import { OpId, Operation } from '../interfaces';


describe('operation/repository', () => {
  describe('Repository', () => {
    const comment1: Operation = { type: 'comment', id: 'c1', data: {}, operator: OP_ADD };
    const comment2: Operation = { type: 'comment', id: 'c2', data: {}, operator: OP_ADD };
    const comment3: Operation = { type: 'comment', id: 'c3', data: {}, operator: OP_ADD };
    const comment4: Operation = { type: 'comment', id: 'c4', data: {}, operator: OP_ADD };

    it('writes existing and new operations', () => {
      const operations = new Map<OpId, Operation>(Object.entries({
        'comment.c1': comment1,
        'comment.c2': comment2,
      }));

      const model = new Model(entities, selectors, {});
      const repo = new Repository(model, operations);

      repo.setInPayload(['comment', 'c3'], comment3);
      repo.setInPayload('comment.c4', comment4);

      const actual = repo.getPayload();

      const expected = new Map<OpId, Operation>(Object.entries({
        'comment.c1': comment1,
        'comment.c2': comment2,
        'comment.c3': comment3,
        'comment.c4': comment4
      }));

      expect(actual).toEqual(expected);
    });

    test('getFromPayload', () => {
      const operations = new Map<OpId, Operation>(Object.entries({
        'comment.c1': comment1,
        'comment.c2': comment2,
      }));

      const model = new Model(entities, selectors, {});
      const repo = new Repository(model, operations);

      const modifiedComment: Operation = { type: 'comment', id: 'c2', data: { text: 'foo' }, operator: OP_ADD };
      repo.setInPayload('comment.c2', modifiedComment);

      let actual;

      actual = repo.getFromPayload('comment', 'c1');
      expect(actual).toEqual(comment1);

      actual = repo.getFromPayload('comment', 'c2');
      expect(actual).toEqual(modifiedComment);
    });

    test('getFromPayloadOrState', () => {
      const operations = new Map<OpId, Operation>(Object.entries({
        'comment.c1': comment1,
      }));

      const state = {
        comment: {
          resources: { 'c2': { text: 'foo' } },
          ids: ['c2']
        }
      };

      const model = new Model(entities, selectors, state);
      const repo = new Repository(model, operations);

      let actual, expected;
      actual = repo.getFromPayloadOrState('comment', 'c1');
      expect(actual).toEqual(comment1);

      actual = repo.getFromPayloadOrState('comment', 'c2');
      expected = { type: 'comment', id: 'c2', data: { text: 'foo' }, operator: OP_EDIT };
      expect(actual).toEqual(expected);

      actual = repo.getFromPayloadOrState('comment', 'c3', true);
      expected = { type: 'comment', id: 'c3', data: {}, operator: OP_ADD };
      expect(actual).toEqual(expected);
    });
  });
});
