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
      addBatch, ADD_BATCH,
      change, CHANGE,
      changeBatch, CHANGE_BATCH,
      remove, REMOVE
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

      test('with type, id, data, and options', () => {
        const actual = add(
          'comment',
          'c1',
          { text: 'foo' },
          { index: 4, addRelated: true }
          );
        const expected = {
          type: ADD,
          resourceType: 'comment',
          resourceId: 'c1',
          resource: { text: 'foo' },
          options: {
            index: 4,
            addRelated: true
          }
        };
        expect(actual).toEqual(expected);
      });
    });

    test('add batch', () => {
      const actual = addBatch(
        ['comment', 'c1'],
        ['comment', 'c2', { text: 'foo' }],
        ['post', 'p1', undefined, { index: 4, addRelated: true }]
      );
      const expected = {
        type: ADD_BATCH,
        resources: [
          ['comment', 'c1'],
          ['comment', 'c2', { text: 'foo' }],
          ['post', 'p1', undefined, { index: 4, addRelated: true }]
        ]
      };
      expect(actual).toEqual(expected);
    });

    test('with type and id', () => {
      const actual = change('comment', 'c1', { text: 'foo' });
      const expected = {
        type: CHANGE,
        resourceType: 'comment',
        resourceId: 'c1',
        resource: { text: 'foo' }
      };
      expect(actual).toEqual(expected);
    });

    test('change batch', () => {
      const actual = changeBatch(
        ['comment', 'c1', { text: 'foo' }],
        ['post', 'p1', { title: 'bar' }]
      );

      const expected = {
        type: CHANGE_BATCH,
        resources: [
          ['comment', 'c1', { text: 'foo' }],
          ['post', 'p1', { title: 'bar' }]
        ]
      };

      expect(actual).toEqual(expected);
    });

    describe('remove', () => {
      test('with type and id', () => {
        const actual = remove('comment', 'c1');

        const expected = {
          type: REMOVE,
          resourceType: 'comment',
          resourceId: 'c1'
        };

        expect(actual).toEqual(expected);
      });

      test('with type, id, and options', () => {
        const actual = remove(
          'user',
          'u1',
          { removeRelated: [['post', 'comment', 'comment'], ['post', 'image']] }
          );

        const expected = {
          type: REMOVE,
          resourceType: 'user',
          resourceId: 'u1',
          options: {
            removeRelated: [['post', 'comment', 'comment'], ['post', 'image']]
          }
        };

        expect(actual).toEqual(expected);
      });
    });

  });
});
