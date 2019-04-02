const { createEntitiesReducer } = require('./index');
const { createEntityActions } = require('../../actions');
const { schemas } = require('../../mocks');

describe('reducer/ids/index', () => {
  describe('createEntitiesReducer', () => {
    const actions = createEntityActions(schemas);
    const reducer = createEntitiesReducer(schemas.skill, actions);

    test('default state', () => {
      const actual = reducer(undefined, { type: '' });
      expect(actual).toEqual({});
    });

    test('passthrough', () => {
      const actual = reducer({}, { type: '' });
      expect(actual).toEqual({});
    });
  });
});