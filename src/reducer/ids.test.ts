import { makeIdsReducer } from './ids';
import { nonObjects, nonMaps } from '../mocks';
import { Operation, Id } from '../interfaces';
import { OP_ADD, OP_REMOVE } from '../constants';
import { ReindexAction } from '../actions';

describe('reducer/ids', () => {
  describe('makeIdsReducer', () => {
    describe('the reducer', () => {
      const actionTypes = {
        ADD: 'ADD',
        REMOVE: 'REMOVE',
        LINK: 'LINK',
        UNLINK: 'UNLINK',
        REINDEX: 'REINDEX',
        REINDEX_RELATED: 'REINDEX_RELATED'
      };
      const reducer = makeIdsReducer('comment', actionTypes);

      it('returns an array by default', () => {
        const actual = reducer(undefined, { type: '', operations: {} });
        expect(actual).toEqual([]);
      });

      describe('reindex', () => {
        const state = ['c1', 'c2', 'c3', 'c4', 'c5'];

        it('reindexes ids', () => {
          const action = {
            type: 'REINDEX',
            resourceType: 'comment',
            source: 3,
            destination: 1
          };

          const actual = reducer(state, action);

          const expected = ['c1', 'c4', 'c2', 'c3', 'c5'];

          expect(actual).toEqual(expected);
        });

        it('ignores reindexing of other resource types', () => {
          const action = {
            type: 'REINDEX',
            resourceType: 'post',
            source: 3,
            destination: 1
          };

          const actual = reducer(state, action);

          expect(actual).toEqual(state);
        });
      });

      describe('add operations', () => {
        test('append', () => {
          const state = ['c1', 'c2'];

          const action = {
            type: '',
            operations: {
              comment: new Map<Id, Operation>(Object.entries({
                'c3': {
                  type: 'comment', id: 'c3', operator: OP_ADD,
                  data: {}, options: {}
                },
              }))
            }
          };

          const actual = reducer(state, action);

          const expected = ['c1', 'c2', 'c3'];

          expect(actual).toEqual(expected);
        });

        test('insert', () => {
          const state = ['c1', 'c2'];

          const action = {
            type: '',
            operations: {
              comment: new Map<Id, Operation>(Object.entries({
                'c3': {
                  type: 'comment', id: 'c3', operator: OP_ADD,
                  data: {}, options: { index: 1 }
                },
              }))
            }
          };

          const actual = reducer(state, action);

          const expected = ['c1', 'c3', 'c2'];

          expect(actual).toEqual(expected);
        });
      });

      test('remove operations', () => {
        const state = ['c1', 'c2', 'c3', 'c4', 'c5'];

        const action = {
          type: '',
          operations: {
            comment: new Map<Id, Operation>(Object.entries({
              'c2': {
                type: 'comment', id: 'c2', operator: OP_REMOVE,
                data: {}, options: {}
              },
              'c4': {
                type: 'comment', id: 'c4', operator: OP_REMOVE,
                data: {}, options: {}
              }
            }))
          }
        };

        const actual = reducer(state, action);

        const expected = ['c1', 'c3', 'c5'];

        expect(actual).toEqual(expected);
      });

      it('ignores operations of other resource types', () => {
        const state = ['c1'];

        const action = {
          type: '',
          operations: {
            comment: new Map<Id, Operation>(Object.entries({
              'c1': {
                type: 'post',
                id: 'c1',
                data: {},
                operator: OP_REMOVE
              },
              'c2': {
                type: 'post',
                id: 'c2',
                data: {},
                operator: OP_ADD
              }
            }))
          }
        };

        const actual = reducer(state, action);

        expect(actual).toEqual(state);
      });

      it('ignores unknown operations', () => {
        const state = ['c1', 'c2'];

        const action = {
          type: '',
          operations: {
            // @ts-ignore
            comment: new Map<Id, Operation>(Object.entries({
              'c1': {
                type: 'post',
                id: 'c1',
                data: {},
                operator: 'unknown'
              },
            }))
          }
        };

        const actual = reducer(state, action);

        expect(actual).toEqual(state);
      });

      describe('skips unhandlable actions', () => {
        const state = ['c1'];

        test('when operations attribute is a non-object', () => {
          nonObjects.forEach(invalidOperationsByType => {
            const action = { type: '', operations: invalidOperationsByType };

            // @ts-ignore
            const actual = reducer(state, action);
            expect(actual).toEqual(state);
          });
        });

        test('non map', () => {
          nonMaps.forEach(invalidOperations => {
            const action = {
              type: '',
              operations: {
                comment: invalidOperations
              }
            };

            // @ts-ignore
            const actual = reducer(state, action);
            expect(actual).toEqual(state);
          });
        });

        test('map of size 0', () => {
          const action = {
            type: '',
            operations: {
              comment: new Map<Id, Operation>()
            }
          };

          // @ts-ignore
          const actual = reducer(state, action);
          expect(actual).toEqual(state);
        });
      });
    });
  });
});
