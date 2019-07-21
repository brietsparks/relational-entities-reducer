import { Schema } from './schema';
import { makeSelectors } from './selectors';
import { Entities } from './schema';


export const fn = () => {};

export const nonObjectOptional = [1, true, 'string', [], fn];
export const nonObjects = [...nonObjectOptional, false , null, undefined];

export const nonStrings = [null, 1, true, false, undefined, [], {}];
export const nonArrays = [null, 1, true, false, 'string', undefined, {}, fn];
export const nonStringsOrNumbers = [null, true, false, undefined, [], {} ,fn];
export const nonNumbers = [null, true, false, undefined, [], {}, 'string', fn];
export const nonIntegers = [...nonNumbers, 1.1];

export const schema: Schema = {
  'user': {
    'authoredPostIds': {
      has: 'many',
      type: 'post',
      reciprocalKey: 'authorId',
      alias: 'authoredPosts'
    },
    'editablePostIds': {
      has: 'many',
      type: 'post',
      reciprocalKey: 'editorIds',
      alias: 'editablePosts'
    },
    'commentIds': {
      has: 'many',
      type: 'comment'
    },
    'profileId:': {
      has: 'one',
      type: 'profile'
    },
    'permissionIds': {
      has: 'many',
      type: 'permission'
    }
  },
  'post': {
    'authorId': {
      has: 'one',
      type: 'user',
      reciprocalKey: 'authoredPostIds',
      alias: 'author'
    },
    'editorIds': {
      has: 'many',
      type: 'user',
      reciprocalKey: 'editablePostIds',
      alias: 'editor'
    },
    'commentIds': {
      has: 'many',
      type: 'comment'
    }
  },
  'comment': {
    'userId': {
      has: 'one',
      type: 'user',
    },
    'postId': {
      has: 'one',
      type: 'post'
    },
    'parentId': {
      has: 'one',
      type: 'comment',
      reciprocalKey: 'childIds',
      alias: 'parentComment'
    },
    'childIds': {
      has: 'many',
      type: 'comment',
      reciprocalKey: 'parentId',
      alias: 'childComments'
    }
  },
  'profile': {
    'userId': {
      has: 'one',
      type: 'user'
    }
  },
  'permission': {
    'userIds': {
      has: 'many',
      type: 'user'
    }
  }
};

export const entities = new Entities(schema);

export const selectors = makeSelectors();

