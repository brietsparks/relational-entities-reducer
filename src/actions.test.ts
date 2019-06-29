import { createActions } from './actions';

describe('createActions', () => {
  const namespace = (actionType: string) => `record.${actionType}`;
  const resourceTypeKey = 'recordType';
  const resourceIdKey = 'recordId';
  const resourceKey = 'record';
  const resourcesKey = 'records';

  describe('default options', () => {
    const {
      add, ADD,
      addBatch, ADD_BATCH
    } = createActions();

    describe('add', () => {
      test('with type and id', () => {
        const actual = add('comment', 'c1');
        const expected = {
          type: ADD,
          resourceType: 'comment',
          resourceId: 'c1',
        };
        expect(actual).toEqual(expected);
      });

      test('with type, id, and data', () => {
        const actual = add('comment', 'c1', { text: 'foo' });
        const expected = {
          type: ADD,
          resourceType: 'comment',
          resourceId: 'c1',
          resource: { text: 'foo' }
        };
        expect(actual).toEqual(expected);
      });

      test('with type, id, data, and index', () => {
        const actual = add('comment', 'c1', { text: 'foo' }, { index: 4 });
        const expected = {
          type: ADD,
          resourceType: 'comment',
          resourceId: 'c1',
          resource: { text: 'foo' },
          options: { index: 4 }
        };
        expect(actual).toEqual(expected);
      });
    });

    test('add batch', () => {
      const actual = addBatch(
        ['comment', 'c1'],
        ['comment', 'c2', { text: 'foo' }],
        ['post', 'p1', undefined, { index: 4 }]
      );
      const expected = {
        type: ADD_BATCH,
        resources: [
          ['comment', 'c1'],
          ['comment', 'c2', { text: 'foo' }],
          ['post', 'p1', undefined, { index: 4 }]
        ]
      };
      expect(actual).toEqual(expected);
    });
  });
});
