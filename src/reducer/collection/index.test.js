const { createCollectionReducer } = require('./index');
const { schemas, emptyState } = require('../../mocks');
const { createEntityActions } = require('../../actions');

describe('reducer/collection/index', () => {
  describe('createCollectionReducer', () => {
    const actions = createEntityActions(schemas);
    const reducer = createCollectionReducer(schemas.skill, actions);

    test('default state', () => {
      const actual = reducer(undefined, { type: '' });
      const expected = {
        entities: {},
        ids: []
      };

      expect(actual).toEqual(expected);
    });

    test('passthrough', () => {
      const actual = reducer(emptyState.skill, { type: '' });
      expect(actual).toEqual(emptyState.skill);
    });
  });
});