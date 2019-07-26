import { makeResourcesReducer } from './resources';
import { nonMaps, nonObjects } from '../mocks';
import { Id, Operation } from '../interfaces';
import { OP_ADD, OP_EDIT, OP_REMOVE } from '../constants';

describe('reducer/resources', () => {
  describe('makeResourcesReducer', () => {
    describe('the reducer', () => {
      const reducer = makeResourcesReducer('comment');

      it('returns an object by default', () => {
        const actual = reducer(undefined, { type: '', operations: {} });
        expect(actual).toEqual({});
      });

      describe('add operations', () => {
        const state = { 'c1': { text: 'foo' } };

        test('new resource', () => {
          const action = {
            type: '',
            operations: {
              comment: new Map<Id, Operation>(Object.entries({
                'c2': {
                  type: 'comment',
                  id: 'c2',
                  data: { text: 'bar' },
                  operator: OP_ADD
                }
              }))
            }
          };

          const actual = reducer(state, action);

          const expected = {
            'c1': { text: 'foo' },
            'c2': { text: 'bar' }
          };

          expect(actual).toEqual(expected);
        });

        test('existing resource', () => {
          const action = {
            type: '',
            operations: {
              comment: new Map<Id, Operation>(Object.entries({
                'c1': {
                  type: 'comment',
                  id: 'c1',
                  data: { text: 'bar' },
                  operator: OP_ADD
                }
              }))
            }
          };

          const actual = reducer(state, action);

          expect(actual).toEqual(state);
        });
      });

      test('edit operations', () => {
        const state = { 'c1': { text: 'foo' } };

        const action = {
          type: '',
          operations: {
            comment: new Map<Id, Operation>(Object.entries({
              'c1': {
                type: 'comment',
                id: 'c1',
                data: { text: 'bar' },
                operator: OP_EDIT
              }
            }))
          }
        };

        const actual = reducer(state, action);

        const expected = { 'c1': { text: 'bar' } };

        expect(actual).toEqual(expected);
      });

      test('remove operations', () => {
        const state = {
          'c1': { text: 'foo' },
          'c2': { text: 'bar' }
        };

        const action = {
          type: '',
          operations: {
            comment: new Map<Id, Operation>(Object.entries({
              'c2': {
                type: 'comment',
                id: 'c2',
                data: {},
                operator: OP_REMOVE
              }
            }))
          }
        };

        const actual = reducer(state, action);

        const expected = { 'c1': { text: 'foo' } };

        expect(actual).toEqual(expected);
      });

      it('ignores operations of other resource types', () => {
        const state = {
          'c1': { text: 'foo' },
          'c2': { text: 'bar' }
        };

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
                data: { text: 'barg' },
                operator: OP_EDIT
              },
              'c3': {
                type: 'post',
                id: 'c3',
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
        const state = {
          'c1': { text: 'foo' },
          'c2': { text: 'bar' }
        };

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
        const state = { 'c1': { text: 'foo' } };

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
