NOT PRODUCTION READY, WORK-IN-PROGRESS

# Relational Entities Reducer [![Coverage Status](https://coveralls.io/repos/github/brietsparks/relational-entities-reducer/badge.svg?branch=master)](https://coveralls.io/github/brietsparks/relational-entities-reducer?branch=master)

Reducers, actions, and selectors for read and write operations on normalized relational state.

- plain old actions + reducers; pure and non-mutating
- create, edit, or delete multiple related resources in a single action 
- manage recursive/self-referencing relations
- framework agnostic and zero-dependency

## Demo
### [Live Demo](https://brietsparks.github.io/relational-entities-reducer-examples)
### [Demo Source Code](https://github.com/brietsparks/relational-entities-reducer-examples)

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

### 2. Pass the schema in and get back reducers, actions, selectors.

```js
import makeRelational from 'relational-entities-reducer';

const { 
  reducer: relationalEntityReducer, 
  actions: relationalActions, 
  selectors: relationalSelectors
} = makeRelational(schema);
```

### 3. Wire up the reducer to your code. 
The reducer is an pure function agnostic of libraries/frameworks, so it 
can be used with or without React, Redux, etc.

Redux:
```js
import { combineReducers } from 'redux';

const reducer = combineReducers({
  // ...
  relationalEntities: relationalEntityReducer
})
```

React Hooks:
```js
import { useReducer } from 'react';

// ...
const [state, dispatch] = useReducer(relationalEntityReducer);   
```

### 4. Pass actions to the reducer to write to state.

You can add, remove, edit, and reindex resources with the following action-creators:
```js
const { add, remove, edit, reindex, reindexRelated } = relationalActions;
```

#### `add`
Adds new resources to state. It takes one or more arguments, each 
being a resource in the shape of a tuple or object.

```js
add(
  { resourceType: 'user', resourceId: 'u3' },
  ['user', 'u4']
)

```

Optionally, a data object can be passed with each resource:
```js
add(
  { resourceType: 'user', resourceId: 'u1', data: { userName: "axolotl" } },
  ['user', 'u2', { userName: 'AzureDiamond', password: 'hunter2' }],
)
```

Related id's can be passed in with the data object, and the state will attach id's to the
corresponding resources to form the relationships. If the those related id's
do not have an existing resource in state, then new ones will be created. 
```js
add(
  // author u1 exists, so the reducer will add p1 to its post ids 
  { resourceType: 'post', resourceId: 'p1', data: { authorId: 'u1' } },
  
  // comment c1 and c2 do not exist, so the reducer will create them and assign p2 to their postId
  ['post', 'p2', { authorId: 'u2', commentIds: ['c1', 'c2'] }] 
)
```
#### `remove`
Removes existing resources from state. It takes one or more arguments, each 
being a resource in the shape of a tuple or object. 
```js
remove(
  { resourceType: 'user', resourceId: 'u3' },
  ['user', 'u4']
)
```

When a resource is removed, the reducer will detach any resources linked
to the removed resources. 

You can also remove a chain of resources in one go. For example, you might want to remove
a user, all its posts, and all comments of those posts. To do this, pass in
a schema to the options parameter:   
```js
const userRemovalSchema = {
  postIds: {
    commentIds: {}
  }
}

remove(
  { resourceType: 'user', resourceId: 'u3', options: { removeRelated: userRemovalSchema } },
  ['user', '4', { removeRelated: userRemovalSchema }]
)
```

#### `edit`
Edits an existing resource. It takes one or more arguments, each 
being a resource in the shape of a tuple or object. 

```js
edit(
  { resourceType: 'user', resourceId: 'u1', data: { userName: "axolotl1" } },
  ['user', 'u2', { userName: 'AzureDiamond10000', password: 'hunter2000' }],
)
```

The operation is a constructive operation. Only the data values passed in will be written 
to the resource; omitting fields from the data payload will not remove those fields from state.

#### `reindex`
Changes the index of a single resource with respect to its top-level order.

```js
reindex('post', 2, 5); // move post at index 2 to index 5
``` 

#### reindexRelated 
Changes the index of a single resource with respect to its order within a related resource.
```js
reindexRelated('post', 'p1', 'commentIds', 3, 6); // in post p1, move comment at index 3 to index 6
```

#### `relate`
Forms a relation between two resources by attaching their ids to one another.

__This feature is in progress__

#### `unrelate`
Eliminate a relation between two resources by removing the related ids which point to on another.

__This feature is in progress__

### 5. Use selectors to read from state
Along with `reducer` and `actions`, this library's function will return `selectors`, 
an object containing selectors that can read from the relation state.

(TODO)

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
