import LinkManager from './link-manager';
import Repository from './repository';
import Model from '../model';
import { entities, selectors } from '../mocks';
import { OpId, Operation } from '../interfaces';
import { OP_EDIT } from '../constants';

describe('operation/link-manager', () => {
  describe('LinkManager', () => {
    describe('unlink', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      describe('one-to-one', () => {
        const user: Operation = {
          type: 'user', id: 'u1',
          data: { profileId: 'pr1' }, operator: OP_EDIT
        };

        const profile: Operation = {
          type: 'profile', id: 'pr1',
          data: { userId: 'u1' }, operator: OP_EDIT
        };

        const operations = new Map<OpId, Operation>(Object.entries({
          'user.u1': user,
          'profile.pr1': profile,
        }));

        const expected = new Map<OpId, Operation>(Object.entries({
          'user.u1': {
            type: 'user', id: 'u1',
            data: { profileId: null }, operator: OP_EDIT
          },
          'profile.pr1': {
            type: 'profile', id: 'pr1',
            data: { userId: null }, operator: OP_EDIT
          }
        }));

        test('case 1', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.unlink(user, 'profileId', 'one', profile, 'userId', 'one');
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 2', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.unlink(profile, 'userId', 'one', user, 'profileId', 'one');
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });
      });

      describe('one-to-many', () => {
        const comment: Operation = {
          type: 'comment', id: 'c1',
          data: { postId: 'p1' }, operator: OP_EDIT
        };

        const post: Operation = {
          type: 'post', id: 'p1',
          data: { commentIds: ['c0', 'c1', 'c2'] }, operator: OP_EDIT
        };

        const operations = new Map<OpId, Operation>(Object.entries({
          'comment.c1': comment,
          'post.p1': post,
        }));

        const expected = new Map<OpId, Operation>(Object.entries({
          'comment.c1': {
            type: 'comment', id: 'c1',
            data: { postId: null }, operator: OP_EDIT
          },
          'post.p1': {
            type: 'post', id: 'p1',
            data: { commentIds: ['c0', 'c2'] }, operator: OP_EDIT
          }
        }));


        test('case 1', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.unlink(comment, 'postId', 'one', post, 'commentIds', 'many');
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 2', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.unlink(post, 'commentIds', 'many', comment, 'postId', 'one');
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });
      });

      describe('many-to-many', () => {
        const user: Operation = {
          type: 'user', id: 'u1',
          data: { permissionIds: ['pm0', 'pm1', 'pm2'] }, operator: OP_EDIT
        };

        const permission: Operation = {
          type: 'permission', id: 'pm1',
          data: { userIds: ['u2', 'u1', 'u2'] }, operator: OP_EDIT
        };

        const operations = new Map<OpId, Operation>(Object.entries({
          'user.u1': user,
          'permission.pm1': permission,
        }));

        const expected = new Map<OpId, Operation>(Object.entries({
          'user.u1': {
            type: 'user', id: 'u1',
            data: { permissionIds: ['pm0', 'pm2'] }, operator: OP_EDIT
          },
          'permission.pm1': {
            type: 'permission', id: 'pm1',
            data: { userIds: ['u2', 'u2'] }, operator: OP_EDIT
          },
        }));

        test('case 1', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.unlink(user, 'permissionIds', 'many', permission, 'userIds', 'many');
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 2', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.unlink(permission, 'userIds', 'many', user, 'permissionIds', 'many');
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });
      });
    });


    describe('link', () => {
      const model = new Model(entities, selectors, entities.getEmptyState());

      describe('one-to-one', () => {
        const user1: Operation = {
          type: 'user', id: 'u1',
          data: { profileId: 'pr1' }, operator: OP_EDIT
        };

        const user2: Operation = {
          type: 'user', id: 'u2',
          data: { profileId: 'pr2' }, operator: OP_EDIT
        };

        const profile1: Operation = {
          type: 'profile', id: 'pr1',
          data: { userId: 'u1' }, operator: OP_EDIT
        };

        const profile2: Operation = {
          type: 'profile', id: 'pr2',
          data: { userId: 'u2' }, operator: OP_EDIT
        };

        const operations = new Map<OpId, Operation>(Object.entries({
          'user.u1': user1,
          'user.u2': user2,
          'profile.pr1': profile1,
          'profile.pr2': profile2
        }));


        const expected = new Map<OpId, Operation>(Object.entries({
          'user.u1': {
            type: 'user', id: 'u1',
            data: { profileId: null }, operator: OP_EDIT
          },
          'user.u2': {
            type: 'user', id: 'u2',
            data: { profileId: 'pr1' }, operator: OP_EDIT
          },
          'profile.pr1': {
            type: 'profile', id: 'pr1',
            data: { userId: 'u2' }, operator: OP_EDIT
          },
          'profile.pr2': {
            type: 'profile', id: 'pr2',
            data: { userId: null }, operator: OP_EDIT
          }
        }));

        let repository: Repository, linkManager: LinkManager;
        beforeEach(() => {
          repository = new Repository(model, operations);
          linkManager = new LinkManager(repository);
        });

        test('case 1', () => {
          linkManager.link(
            user2, 'profileId', 'one', undefined,
            profile1, 'userId', 'one', undefined
          );

          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 2', () => {
          linkManager.link(
            profile1, 'userId', 'one', undefined,
            user2, 'profileId', 'one', undefined
          );

          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });
      });

      describe('one-to-many', () => {
        const comment1: Operation = {
          type: 'comment', id: 'c1',
          data: { postId: 'p1' }, operator: OP_EDIT
        };

        const comment2: Operation = {
          type: 'comment', id: 'c2',
          data: { postId: 'p2' }, operator: OP_EDIT
        };

        const post1: Operation = {
          type: 'post', id: 'p1',
          data: { commentIds: ['c1'] }, operator: OP_EDIT
        };

        const post2: Operation = {
          type: 'post', id: 'p2',
          data: { commentIds: ['c0', 'c2'] }, operator: OP_EDIT
        };

        const operations = new Map<OpId, Operation>(Object.entries({
          'comment.c1': comment1,
          'comment.c2': comment2,
          'post.p1': post1,
          'post.p2': post2
        }));

        const expected = new Map<OpId, Operation>(Object.entries({
          'comment.c1': {
            type: 'comment', id: 'c1',
            data: { postId: 'p2' }, operator: OP_EDIT
          },
          'comment.c2': {
            type: 'comment', id: 'c2',
            data: { postId: 'p2' }, operator: OP_EDIT
          },
          'post.p1': {
            type: 'post', id: 'p1',
            data: { commentIds: [] }, operator: OP_EDIT
          },
          'post.p2': {
            type: 'post', id: 'p2',
            data: { commentIds: ['c0', 'c1', 'c2'] }, operator: OP_EDIT
          }
        }));

        let repository: Repository, linkManager: LinkManager;
        beforeEach(() => {
          repository = new Repository(model, operations);
          linkManager = new LinkManager(repository);
        });

        test('case 1', () => {
          linkManager.link(
            comment1, 'postId', 'one', undefined,
            post2, 'commentIds', 'many', 1
          );

          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 2', () => {
          linkManager.link(
            post2, 'commentIds', 'many', 1,
            comment1, 'postId', 'one', undefined
          );

          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 3', () => {
          linkManager.link(
            comment1, 'postId', 'one', 100,
            post2, 'commentIds', 'many', 1
          );

          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 4', () => {
          linkManager.link(
            post2, 'commentIds', 'many', 1,
            comment1, 'postId', 'one', 100
          );

          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });
      });

      describe('many-to-many', () => {
        const user: Operation = {
          type: 'user', id: 'u1',
          data: { permissionIds: ['pm0', 'pm2'] }, operator: OP_EDIT
        };

        const permission: Operation = {
          type: 'permission', id: 'pm1',
          data: { userIds: ['u2', 'u2'] }, operator: OP_EDIT
        };

        const operations = new Map<OpId, Operation>(Object.entries({
          'user.u1': user,
          'permission.pm1': permission,
        }));

        const expected = new Map<OpId, Operation>(Object.entries({
          'user.u1': {
            type: 'user', id: 'u1',
            data: { permissionIds: ['pm0', 'pm1', 'pm2'] }, operator: OP_EDIT
          },
          'permission.pm1': {
            type: 'permission', id: 'pm1',
            data: { userIds: ['u2', 'u1', 'u2'] }, operator: OP_EDIT
          },
        }));

        test('case 1', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.link(
            user, 'permissionIds', 'many', 1,
            permission, 'userIds', 'many', 1,
          );
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });

        test('case 2', () => {
          const repository = new Repository(model, operations);
          const linkManager = new LinkManager(repository);
          linkManager.link(
            permission, 'userIds', 'many', 1,
            user, 'permissionIds', 'many', 1,
          );
          const actual = repository.getPayload();
          expect(actual).toEqual(expected);
        });
      });
    });

  });
});
