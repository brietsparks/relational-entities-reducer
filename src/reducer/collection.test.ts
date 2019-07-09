import { createCollectionReducer } from './collection';

describe('reducer/collection', () => {
  describe('createCollectionReducer', () => {
    it('returns empty state by default', () => {
      const reducer = createCollectionReducer(
        'comment',
        { ADD: 'ADD', REMOVE: 'REMOVE', EDIT: 'EDIT' }
      );

      const actual = reducer(undefined, { type: '' });

      const expected = {
        resources: {},
        ids: []
      };

      expect(actual).toEqual(expected);
    });
  });
});
