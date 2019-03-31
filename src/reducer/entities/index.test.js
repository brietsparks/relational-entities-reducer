const { createEntitiesReducer } = require('./index');
const { createEntityActions } = require('../../actions');
const { schemas, emptyState } = require('../../mocks');

describe('reducer/entities/index', () => {
  const actions = createEntityActions(schemas);
  const entitiesReducer = createEntitiesReducer(schemas, actions);

  test('default state', () => {
    const actual = entitiesReducer(undefined, { type: '' });
    expect(actual).toEqual(emptyState.entities);
  });

  test('passthrough', () => {
    const actual = entitiesReducer(emptyState.entities, { type: '' });
    expect(actual).toEqual(emptyState.entities);
  });
});