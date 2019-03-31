const { createIdsReducer } = require('./ids-reducer');
const { createEntityActions } = require('../actions');
const { schemas, emptyState } = require('../mocks');

describe('createIdsReducer', () => {
  const actions = createEntityActions(schemas);
  const idsReducer = createIdsReducer(schemas, actions);

  test('default state', () => {
    const actual = idsReducer(undefined, { type: '' });
    expect(actual).toEqual(emptyState.ids);
  });

  test('passthrough', () => {
    const actual = idsReducer(emptyState.ids, { type: '' });
    expect(actual).toEqual(emptyState.ids);
  });
});