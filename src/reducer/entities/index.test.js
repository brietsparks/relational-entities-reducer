const { createEntitiesReducer } = require('./index');
const { createEntityActions } = require('../../actions');
const { schemaDefs } = require('../../mocks');

describe('reducer/ids/index', () => {
  describe('createEntitiesReducer', () => {
    const actions = createEntityActions(schemaDefs);
    const reducer = createEntitiesReducer(schemaDefs.skill, actions);

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