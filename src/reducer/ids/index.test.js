const { createIdsReducer } = require('./index');
const { createEntityActions } = require('../../actions');
const { schemas } = require('../../mocks');

describe('reducer/ids/index', () => {
  describe('createIdsReducer', () => {
    const actions = createEntityActions(schemas);
    const reducer = createIdsReducer(schemas.skill, actions);

    test('default state', () => {
      const actual = reducer(undefined, { type: '' });
      expect(actual).toEqual([]);
    });

    test('passthrough', () => {
      const actual = reducer([], { type: '' });
      expect(actual).toEqual([]);
    });
  });
});