import filterByExistence from './filter-by-existence';
import { Model } from '../model';
import { modelSchema } from '../mocks';

describe('interceptors/filter-by-Existence', () => {
  const model = new Model(modelSchema);

  const state = {
    'comment': {
      resources: { 'c2': {}, 'c3': {} },
      ids: ['c2', 'c3']
    },
    'post': {
      resources: { 'p1': {}, 'p2': {} },
      ids: ['p1', 'p2']
    }
  };

  const resources = new Map(Object.entries({
      'comment.c1': { resourceType: 'comment', resourceId: 'c1' },
      'comment.c2': { resourceType: 'comment', resourceId: 'c2' },
      'comment.c3': { resourceType: 'comment', resourceId: 'c3' },
      'comment.c4': { resourceType: 'comment', resourceId: 'c4' },
      'post.p1': { resourceType: 'post', resourceId: 'p1' },
      'post.p2': { resourceType: 'post', resourceId: 'p2' },
      'post.p3': { resourceType: 'post', resourceId: 'p3' },
      'post.p4': { resourceType: 'post', resourceId: 'p4' },
    }
  ));

  it('can exclude items that already exist in state', () => {
    const action = { type: 'whatever', resources };

    const actual = filterByExistence(model, state, action, false);

    const expected = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c1': { resourceType: 'comment', resourceId: 'c1' },
        'comment.c4': { resourceType: 'comment', resourceId: 'c4' },
        'post.p3': { resourceType: 'post', resourceId: 'p3' },
        'post.p4': { resourceType: 'post', resourceId: 'p4' },
      }))
    };

    expect(actual).toEqual(expected);
  });

  it('can exclude items that do not exist in state', () => {
    const action = { type: 'whatever', resources };

    const actual = filterByExistence(model, state, action, true);

    const expected = {
      type: 'whatever',
      resources: new Map(Object.entries({
        'comment.c2': { resourceType: 'comment', resourceId: 'c2' },
        'comment.c3': { resourceType: 'comment', resourceId: 'c3' },
        'post.p1': { resourceType: 'post', resourceId: 'p1' },
        'post.p2': { resourceType: 'post', resourceId: 'p2' },
      }))
    };

    expect(actual).toEqual(expected);
  });
});
