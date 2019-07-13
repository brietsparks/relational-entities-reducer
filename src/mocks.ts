export const fn = () => {};

export const nonObjectOptional = [1, true, 'string', [], fn];
export const nonObjects = [...nonObjectOptional, false , null, undefined];

export const nonStrings = [null, 1, true, false, undefined, [], {}];
export const nonArrays = [null, 1, true, false, 'string', undefined, {}, fn];
export const nonStringsOrNumbers = [null, true, false, undefined, [], {} ,fn];
export const nonNumbers = [null, true, false, undefined, [], {}, 'string', fn];
export const nonIntegers = [...nonNumbers, 1.1];


export const modelSchema = {
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
