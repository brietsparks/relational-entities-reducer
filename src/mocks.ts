//

import { ModelSchema } from './model';

export const nonObjectOptional = [1, true, 'string', [], () => {}, function () {}];
export const nonObjects = [...nonObjectOptional, false , null, undefined];

export const nonStrings = [null, 1, true, false, undefined, [], {}];
export const nonArrays = [null, 1, true, false, 'string', undefined, {}, () => {}, function() {}];
export const nonStringsOrNumbers = [null, true, false, undefined, [], {} ,() => {}, function() {}];
export const nonNumbers = [null, true, false, undefined, [], {}, 'string', () => {}, function() {}];
export const nonIntegers = [...nonNumbers, 1.1];


export const modelSchema: ModelSchema = {
  'user': {
    'authoredPostIds': {
      has: 'many',
      type: 'post',
      reciprocalKey: 'authorId'
    },
    'editablePostIds': {
      has: 'many',
      type: 'post',
      reciprocalKey: 'editorIds'
    },
    'commentIds': {
      has: 'many',
      type: 'comment'
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
      reciprocalKey: 'authoredPostIds'
    },
    'editorIds': {
      has: 'many',
      type: 'user',
      reciprocalKey: 'editablePostIds'
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
      reciprocalKey: 'childIds'
    },
    'childIds': {
      has: 'many',
      type: 'comment',
      reciprocalKey: 'parentId'
    }
  },
  'permission': {
    'userIds': {
      has: 'many',
      type: 'user'
    }
  }
};
