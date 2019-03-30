const { getEntities, getEntity, getLinkedEntityKeys } = require('./selectors');

describe('selectors', () => {
  describe('getEntities', () => {
    test('throws if entityType dne', () => {
      const state = {
        entities: { foo: {} }
      };

      const actual = () => getEntities(state, { entityType: 'bar' });
      const error = new Error('entity type "bar" not found');
      expect(actual).toThrow(error);
    });

    test('happy', () => {
      const state = {
        entities: { foo: { a: {} } }
      };

      const actual = getEntities(state, { entityType: 'foo' });
      const expected = { a: {} };

      expect(actual).toEqual(expected);
    });
  });

  test('getEntity', () => {
    const state = {
      entities: {
        foo: {
          a: { id: 'a' }
        }
      }
    };

    const actual = getEntity(state, { entityType: 'foo', entityKey: 'a' });
    const expected = { id: 'a' };

    expect(actual).toEqual(expected);
  });

  describe('getLinkedEntityKeys', () => {
    test('if entity not found', () => {
      const state = {
        entities: {
          foo: {}
        }
      };

      const actual = getLinkedEntityKeys(state, {
        entityType: 'foo',
        entityKey: 'a',
        linkedEntityType: 'bar'
      });

      expect(actual).toEqual(undefined);
    });

    test('if relation not found', () => {
      const state = {
        entities: {
          foo: {
            a: { id: 'a' }
          }
        }
      };

      const actual = getLinkedEntityKeys(state, {
        entityType: 'foo',
        entityKey: 'a',
        linkedEntityType: 'bar'
      });

      expect(actual).toEqual(undefined)
    });
    test('happy', () => {
      const state = {
        entities: {
          foo: {
            a: {
              id: 'a',
              barKeys: ['b']
            }
          },
        }
      };

      const actual = getLinkedEntityKeys(state, {
        entityType: 'foo',
        entityKey: 'a',
        linkedEntityType: 'bar'
      });

      const expected = ['b'];

      expect(actual).toEqual(expected);
    });
  });


});