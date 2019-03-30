const { createEntitiesReducer } = require('./entities-reducer');
const { createEntityActions } = require('../actions');
const { schemas, emptyState } = require('../mocks');

describe('createEntitiesReducer', () => {
  test('passthrough', () => {
    const actions = createEntityActions(schemas);
    const entitiesReducer = createEntitiesReducer(schemas, actions);

    const actual = entitiesReducer(emptyState.entities, { type: '' });

    expect(actual).toEqual(emptyState.entities);
  });
});