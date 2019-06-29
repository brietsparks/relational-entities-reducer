import { createActions } from './actions';

describe('createActions', () => {
  const namespace = (actionType: string) => `thing.${actionType}`;
  const resourceTypeKey = 'thingType';
  const resourceIdKey = 'thingId';
  const resourceKey = 'thing';
  const resourcesKey = 'things';

  describe('default options', () => {
    const {
      add, ADD,
      addMany, ADD_MANY
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
        const actual = add('comment', 'c1', { text: 'foo' }, 4);
        const expected = {
          type: ADD,
          resourceType: 'comment',
          resourceId: 'c1',
          resource: { text: 'foo' },
          index: 4
        };
        expect(actual).toEqual(expected);
      });
    });

    test('add many', () => {
      const actual = addMany(
        ['comment', 'c1'],
        ['comment', 'c2', { text: 'foo' }],
        ['post', 'p1', undefined, 4]
      );
      const expected = {
        type: ADD_MANY,
        resources: [
          ['comment', 'c1'],
          ['comment', 'c2', { text: 'foo' }],
          ['post', 'p1', undefined, 4]
        ]
      };
      expect(actual).toEqual(expected);
    });
  });
});
