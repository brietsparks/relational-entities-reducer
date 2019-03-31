const { createIdsReducer } = require('./ids-reducer');
const { createEntityActions } = require('../actions');
const { schemas, emptyState } = require('../mocks');

describe('createIdsReducer', () => {
  test('passthrough', () => {
    const actions = createEntityActions(schemas);
    const keyReducer = createIdsReducer(schemas, actions);

    const actual = keyReducer(emptyState.ids, { type: '' });

    expect(actual).toEqual(emptyState.ids);
  });
});