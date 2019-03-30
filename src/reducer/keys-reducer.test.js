const { createKeysReducer } = require('./keys-reducer');
const { createEntityActions } = require('../actions');
const { schemas, emptyState } = require('../mocks');

describe('createEntitiesReducer', () => {
  test('passthrough', () => {
    const actions = createEntityActions(schemas);
    const keyReducer = createKeysReducer(schemas, actions);

    const actual = keyReducer(emptyState.keys, { type: '' });

    expect(actual).toEqual(emptyState.keys);
  });
});