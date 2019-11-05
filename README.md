# Relational Entities Reducer [![Coverage Status](https://coveralls.io/repos/github/brietsparks/relational-entities-reducer/badge.svg?branch=master)](https://coveralls.io/github/brietsparks/relational-entities-reducer?branch=master)

Manage relational state via a simple, declarative API.
- pure functions (actions + reducers) and framework agnostic
- supports one and many cardinalities, and recursive/self-referencing relations

## Examples
### [Live Demo](https://brietsparks.github.io/relational-entities-reducer-examples)
### [Source](https://github.com/brietsparks/relational-entities-reducer-examples)

## Basic Usage
Install: `yarn add relational-entities-reducer`

#### 1. Define how your data are related to each other:
```js
const schema = {
  user: {
    postIds: { has: 'many', type: 'post' }
  },
  post: {
    authorId: { has: 'one', type: 'user' },
    commentIds: { has: 'many', type: 'comment' }
  },
  comment: {
    commenterId: { has: 'one', type: 'user' },
    postId: { has: 'one', type: 'post' }
  }
};
```

### 2. Pass the schema to the library function.

```js
import makeEntities from 'relational-entities-reducer';

const entities = makeEntities(schema);

const { 
  actionCreators,
  actionTypes,
  reducer,
  selectors,
  emptyState,
} = entities;
```

### 3. Wire up the reducer to your code. 
The reducer is an pure function agnostic of libraries/frameworks, so it 
can be used with or without React, Redux, etc.

Redux:
```js
import { createStore } from 'redux';

const store = createStore(entities.reducer, emptyState);
```

React Hooks:
```js
import { useReducer } from 'react';

const [state, dispatch] = useReducer(entities.reducer, emptyState);   
```

### 4. Pass actions to the reducer to write to state.

You can add, remove, edit, link, unlink, and reindex resources with the following action-creators:
```js
const { 
  add, 
  remove, 
  edit, 
  link,
  unlink,
  reindex, 
  reindexRelated
} = entities.actionCreators;
```

#### `add`
Adds new resources to state. It takes one or more arguments, each 
a tuple or object describing a new resource.

```js
add(
  { type: 'user', id: 'u3' },
  ['user', 'u4']
)

```

Optionally, a data object can be passed with each arg:
```js
add(
  { type: 'user', id: 'u1', data: { userName: "axolotl" } },
  ['user', 'u2', { userName: 'AzureDiamond', password: 'hunter2' }],
)
```

Related id's can be passed in with the data object, and the reducer will attach id's to the
corresponding resources to form the relationships. If the those related id's
do not have an existing resource in state, then new ones will be created. 
```js
add(
  // object arg
  { type: 'post', id: 'p1', data: { authorId: 'u1' } },
  
  // tuple arg
  ['post', 'p2', { authorId: 'u2', commentIds: ['c1', 'c2'] }] 
)
```
#### `remove`
Removes existing resources from state. It takes one or more arguments, each a 
tuple or object describing a resource removal. 
```js
remove(
  // object arg
  { type: 'user', id: 'u3' },
  
  // tuple arg
  ['user', 'u4']
)
```

When a resource is removed, the reducer will detach any resources linked
to the removed resources. In the above example, any resources linked to
users `u3`, `u4` would be unlinked from them.

You can also remove a chain of resources in one go. For example, you might want to remove
a user, all its posts, and all comments of those posts. To do this, pass in an `options` 
object with a `removalSchema` that describes the chain of resource removals:   
```js
const userRemovalSchema = {
  postIds: {
    commentIds: {}
  }
}

remove(
  { type: 'user', id: 'u3', options: { removeRelated: userRemovalSchema } },
  ['user', '4', { removeRelated: userRemovalSchema }]
)
```

#### `edit`
Edits existing resources. It takes one or more arguments, each an object or tuple
describing a resource modification. 

```js
edit(
  // object arg
  { type: 'user', id: 'u1', data: { userName: "axolotl1" } },
  
  // tuple arg
  ['user', 'u2', { userName: 'AzureDiamond10000', password: 'hunter2000' }],
)
```

The operation is a constructive operation. Only the data values passed in will be written 
to the resource; omitting fields from the data payload will not remove those fields from state.

**Warning:** do not modify relational data in the edit action. If you do, you will probably 
end up with invalid state. Instead use the `link` and `unlink` action creators. 
Modifying relational data via `edit` might be supported in the future.  

#### `reindex`
Changes the index of a single resource with respect to its top-level order.

```js
// move post at index 2 to index 5
reindex('post', 2, 5);
``` 

#### reindexRelated 
Within a single resource, change the index of a single linked resource.
```js
// in post p1, move comment at index 3 to index 6
reindexRelated('post', 'p1', 'commentIds', 3, 6);
```

#### `link`
Links resources by attaching their ids to one another. It takes one or more arguments,
each an object or tuple describing which resources to link together.

```js
link(
  // object arg, link post p1 to comment c1
  { type: 'post', id: 'p1', relation: 'commentIds', linkedId: 'c1', indices: [] }
  
  // tuple arg, link comment c2 to post p1
  ['comment', 'c2', 'postId', 'p1', []]
);
```

The array param is where you can specify the index at which 
each id should be within its linked resource.

```js
link(
  // in post p1's commentIds, c1 will get added at index 2 
  ['post', 'p1', 'commentIds', 'c1', [2]] 
);
```

For a many-to-many relationship, you can pass in two indices.
```js
link(
  // a post has-many tags, a tag has-many posts 
  // post p2 will have t2 at index 2, and tag t2 will have post p2 at index 5 
  ['post', 'p2', 'tagIds', 't2', [2, 5]] 
);
```

The indices arg will be optional in the future.

#### `unlink`
Unlinks resources by removing their ids from one another. It takes one or more arguments,
each an object or tuple describing which resources to unlink.

```js
unlink(
  // unlink post p1 from comment c1
  { type: 'post', id: 'p1', relation: 'commentIds', linkedId: 'c1' },
  
  // unlink comment c2 from post p2
  ['comment', 'c2', 'postId', 'p2']  
)
```

### 5. Use selectors to read from state
This library's function returns a `selectors` object containing simple selector functions 
that can read from the relation state.

```js
const { selectors } = makeEntities(schema);
```

#### `getEntityResources`
Accepts state and the resource type and returns an object mapping the ids to their resources.
```js
const resources = selectors.getEntityResources(state, { type: 'post' });
console.log(resources); // { p1: {...}, p2: {...}, ... }
```

#### `getEntityIds`
Accepts state and the resource type and returns an array of the top-level ids.
```js
const ids = selectors.getEntityIds(state, { type: 'post' });
console.log(ids); // ['p1', 'p2', ...]
```

#### `getResource`
Accepts state, the resource type, and the resource id, and returns the resource if it exists.
```js
const resource = selectors.getResource(state, { type: 'post', id: 'p1' });
console.log(resource); // { title: '...', commentIds: [...] }
```

## Advanced Usage

### Multiple foreign keys for a related entity
To have multiple foreign keys point to the same entity, 
define a `reciprocalKey` for both entities in the schema:

```js
const schema = {
  user: {
    authoredPostIds: {
      has: 'many',
      type: 'post',
      reciprocalKey: 'authorId'
    },
    editablePostIds: {
      has: 'many',
      type: 'post',
      reciprocalKey: 'editorIds'
    }
  },
  post: {
    authorId: {
      has: 'one',
      type: 'user',
      reciprocalKey: 'authoredPostIds'
    },
    editorIds: {
      has: 'many',
      type: 'user',
      reciprocalKey: 'editablePostIds'
    }
  }
}
```

### Self-referencing/recursive relationships

You might need a self-referencing/recursive resource, such as comment tree.
To do this, define the schema as such:

```js
const schema = {
  comment: {
    parentId: {
      has: 'one',
      type: 'comment',
      reciprocalKey: 'childIds'
    },
    childIds: {
      has: 'many',
      type: 'comment',
      reciprocalKey: 'parentId'
    }
  }
}
```

To remove a resource and child descendants recursively:
```js
const commentRemovalSchema = () => ({
  childIds: commentRemovalSchema
});

const userRemovalSchema = () => ({
  postIds: {
    commentIds: commentRemovalSchema
  }
})

remove(
  ['comment', 'c1', { removeRelated: commentRemovalSchema }],
  ['user', 'u1', { removeRelated: userRemovalSchema }]
)
``` 
