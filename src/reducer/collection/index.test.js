const { createCollectionReducer } = require('./index');
const { schemaDefs, emptyState } = require('../../mocks');
const { createEntityActions } = require('../../actions');

describe('reducer/collection/index', () => {
  describe('createCollectionReducer', () => {
    const actions = createEntityActions(schemaDefs);
    const reducer = createCollectionReducer(schemaDefs.skill, actions);

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