import { entities, selectors } from '../mocks';
import Model from '../model';
import transformRemoveOperations, { byRelationKey, extractNestedRemovalSchema } from './remove';
import { OpId, RemoveOperation, Operation } from '../interfaces';
import { OP_EDIT, OP_REMOVE } from '../constants';

describe('transformers/remove', () => {
  describe('transformRemoveOperations', () => {
    it('detaches links to state resources', () => {
      const state = {
        user: {
          resources: {
            'u1': { authoredPostIds: ['p0', 'p1', 'p2'] },
            'u2': { editablePostIds: ['p0', 'p1', 'p2'] }
          },
          ids: ['u1', 'u2']
        },
        post: {
          resources: {
            'p0': {},
            'p1': { authorId: 'u1', editorIds: ['u2'], commentIds: ['c1'] },
            'p2': {}
          },
          ids: ['p0', 'p1', 'p2']
        },
        comment: {
          resources: {
            'c1': { postId: 'p1' }
          },
          ids: ['c1']
        }
      };

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, RemoveOperation>(Object.entries({
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: {},
          options: {},
          operator: OP_REMOVE
        }
      }));

      const actual = transformRemoveOperations(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: {},
          options: {},
          operator: OP_REMOVE
        },
        'user.u1': {
          type: 'user',
          id: 'u1',
          data: { authoredPostIds: ['p0', 'p2'] },
          operator: OP_EDIT
        },
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          data: { postId: null },
          operator: OP_EDIT
        },
        'user.u2': {
          type: 'user',
          id: 'u2',
          data: { editablePostIds: ['p0', 'p2'] },
          operator: OP_EDIT
        },
      }));

      expect(actual).toEqual(expected);
    });

    it('removes operations according to a removalSchema', () => {
      const state = {
        user: {
          resources: {
            'u1': {
              authoredPostIds: ['p1'],
              editablePostIds: ['p2']
            }
          },
          ids: ['u1']
        },
        post: {
          resources: {
            'p1': { authorId: 'u1', commentIds: ['c1'] },
            'p2': { editorIds: ['p2'] }
          },
          ids: ['p1', 'p2']
        },
        comment: {
          resources: {
            'c1': { postId: 'p1' }
          },
          ids: ['c1']
        }
      };

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, RemoveOperation>(Object.entries({
        'user.u1': {
          type: 'user',
          id: 'u1',
          data: {},
          options: {
            removalSchema: {
              authoredPosts: {
                comment: {}
              }
            }
          },
          operator: OP_REMOVE
        }
      }));

      const actual = transformRemoveOperations(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'user.u1': {
          type: 'user',
          id: 'u1',
          data: {},
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              authoredPosts: {
                comment: {}
              }
            }
          },
        },
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: { authorId: 'u1', commentIds: ['c1'] },
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              comment: {}
            }
          }
        },
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          data: { postId: 'p1' },
          operator: OP_REMOVE,
          options: { removalSchema: {} }
        },
        'post.p2': {
          type: 'post',
          id: 'p2',
          data: { editorIds: [] },
          operator: OP_EDIT,
        },
      }));

      expect(actual).toEqual(expected);
    });

    test('removalSchema removals plus their linked resources', () => {
      const state = {
        user: {
          resources: {
            'u1': { authoredPostIds: ['p1'] },
            'u2': { editablePostIds: ['p0', 'p1', 'p2'] }
          },
          ids: ['u1', 'u2']
        },
        post: {
          resources: {
            'p0': { editorIds: ['u2'] },
            'p1': { editorIds: ['u2'], authorId: 'u1' },
            'p2': { editorIds: ['u2'] },
          },
          ids: ['p0', 'p1', 'p2']
        }
      };

      const model = new Model(entities, selectors, state);

      const operations = new Map<OpId, RemoveOperation>(Object.entries({
        'user.u1': {
          type: 'user',
          id: 'u1',
          data: {},
          options: {
            removalSchema: {
              authoredPosts: {}
            }
          },
          operator: OP_REMOVE
        }
      }));

      const actual = transformRemoveOperations(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'user.u1': {
          type: 'user',
          id: 'u1',
          data: {},
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              authoredPosts: {}
            }
          },
        },
        'post.p1': {
          type: 'post',
          id: 'p1',
          data: { authorId: 'u1', editorIds: [] },
          operator: OP_REMOVE,
          options: { removalSchema: {} },
        },
        'user.u2': {
          type: 'user',
          id: 'u2',
          data: { editablePostIds: ['p0', 'p2'] },
          operator: OP_EDIT,
        }
      }));

      expect(actual).toEqual(expected);
    });

    it('removes resources recursively', () => {
      const state = {
        post: {
          resources: { 'p1': { commentIds: ['c1'] }, },
          ids: ['p1']
        },
        comment: {
          resources: {
            'c1': { childIds: ['c2'] },
            'c2': { parentId: 'c1', childIds: ['c3'] },
            'c3': { parentId: 'c2', childIds: ['c4'] },
            'c4': { parentId: 'c3' }
          },
          ids: ['c1', 'c2', 'c3', 'c4']
        }
      };

      const model = new Model(entities, selectors, state);

      const commentRemovalSchema = () => ({
        childComments: commentRemovalSchema
      });

      const operations = new Map<OpId, RemoveOperation>(Object.entries({
        'p1': {
          type: 'post',
          id: 'p1',
          data: {},
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              commentIds: commentRemovalSchema
            }
          }
        }
      }));

      const actual = transformRemoveOperations(model, operations);

      const expected = new Map<OpId, Operation>(Object.entries({
        'p1': {
          type: 'post',
          id: 'p1',
          data: {},
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              commentIds: commentRemovalSchema
            }
          }
        },
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          data: { childIds: ['c2'] },
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              childComments: commentRemovalSchema
            }
          }
        },
        'comment.c2': {
          type: 'comment',
          id: 'c2',
          data: { parentId: 'c1', childIds: ['c3'] },
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              childComments: commentRemovalSchema
            }
          }
        },
        'comment.c3': {
          type: 'comment',
          id: 'c3',
          data: { parentId: 'c2', childIds: ['c4'] },
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              childComments: commentRemovalSchema
            }
          }
        },
        'comment.c4': {
          type: 'comment',
          id: 'c4',
          data: { parentId: 'c3' },
          operator: OP_REMOVE,
          options: {
            removalSchema: {
              childComments: commentRemovalSchema
            }
          }
        }
      }));

      expect(actual).toEqual(expected);
    });

    it('omits operations of nonexistent resources', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const operations = new Map<OpId, RemoveOperation>(Object.entries({
        'comment.c1': {
          type: 'comment',
          id: 'c1',
          data: {},
          operator: OP_REMOVE,
          options: {}
        },
        'comment.c2': {
          type: 'comment',
          id: 'c2',
          data: {},
          operator: OP_REMOVE,
          options: {}
        }
      }));

      const actual = transformRemoveOperations(model, operations);

      const expected = new Map<OpId, Operation>();

      expect(actual).toEqual(expected);
    });

    describe('does not duplicate removal operations', () => {
      test('case 1', () => {
        const state = {
          post: {
            resources: { 'p1': { commentIds: ['c1', 'c2'] } },
            ids: ['p1']
          },
          comment: {
            resources: {
              'c1': { postId: 'p1' },
              'c2': { postId: 'p1' }
            },
            ids: ['c1', 'c2']
          }
        };

        const model = new Model(entities, selectors, state);

        const operations = new Map<OpId, RemoveOperation>(Object.entries({
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            data: {},
            operator: OP_REMOVE,
            options: {}
          },
          'post.p1': {
            type: 'post',
            id: 'p1',
            data: {},
            operator: OP_REMOVE,
            options: {
              removalSchema: {
                commentIds: {}
              }
            }
          }
        }));

        const actual = transformRemoveOperations(model, operations);

        const expected = new Map<OpId, Operation>(Object.entries({
          'post.p1': {
            type: 'post',
            id: 'p1',
            data: {},
            operator: OP_REMOVE,
            options: {
              removalSchema: {
                commentIds: {}
              }
            }
          },
          'comment.c1': {
            type: 'comment',
            id: 'c1',
            data: {},
            operator: OP_REMOVE,
            options: {}
          },
          'comment.c2': {
            type: 'comment',
            id: 'c2',
            data: { postId: 'p1' },
            operator: OP_REMOVE,
            options: { removalSchema: {} }
          }
        }));

        expect(actual).toEqual(expected);
      });
    });

    test('empty data', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      const operations = new Map<OpId, RemoveOperation>();

      const actual = transformRemoveOperations(model, operations);

      const expected = new Map<OpId, Operation>();

      expect(actual).toEqual(expected);
    });
  });

  test('byRelationKey', () => {
    const model = new Model(entities, selectors, entities.getEmptyState());

    const removalSchema = {
      authoredPosts: {},
      editablePostIds: {},
      comment: {},
      profile: {}
    };

    const actual = byRelationKey('user', model, removalSchema);

    const expected = {
      authoredPostIds: {},
      editablePostIds: {},
      commentIds: {},
      profileId: {}
    };

    expect(actual).toEqual(expected);
  });
});
