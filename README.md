# Relational Entities Reducer

Reducers, actions, and selectors for read and write operations on relational entity state.
- zero-dependency
- framework agnostic (use with/without React, Redux, etc)
- pure, non-mutating functions (no persistent objects behind the scenes)


## Example/Demo

[Example source](https://github.com/brietsparks/relational-entities-reducer-examples)

[Example demo](https://brietsparks.github.io/relational-entities-reducer-examples)

## Installation

Install with npm:

`npm install relational-entities-reducer --save`

Install with yarn:

`yarn add relational-entities-reducer`

## Usage

This library gives you higher-order functions to create a reducer and actions to manage entity state.

1. First, define a schema of your entity relationships:
    
    ```js
    const mySchema = {
        post: {
            many: ['comment', 'category'],
        },
        comment: {
            one: ['post']
        },
        category: {
            many: ['post']
        },
    } 
    ```

2. Then use the schema to make the actions and reducers
    ```js
    import { createReducer, createActions, selectors} from 'relational-entities-reducer';
    
    /* ACTIONS */
    const myEntityActions = createActions(mySchema);
    export const addEntity = myEntityActions.add;
    export const removeEntity = myEntityActions.remove;
    export const editEntity = myEntityActions.edit;
    export const reorderEntity = myEntityActions.reorderEntity;
    
    /* REDUCER */
    const myEntityReducer = createReducer(mySchema, myEntityActions);
    
    const rootReducer = (state, action) => ({
        model: myEntityReducer(state.model, action)    
    });
    
    /* SELECTORS */
    export const getEntityIds = (state, { entityType }) => {
      return selectors.getIds(state.model, { entityType });
    };
    
    export const getEntity = (state, { entityType, entityId }) => {
      return selectors.getEntity(state.model, { entityType, entityId });
    };
    ``` 
3. This initial state would look like:
    ```js
    {
        post: {
            entities: {},
            ids: []
        },
        comment: {
            entities: {},
            ids: []
        },
        categories: {
            entities: {},
            ids: []
        } 
    }
    ```

4. Use the actions to write to state, and the selectors to read from state. (see next section)

## API

Use the higher-order-functions `createActions` and `createReducer` to create actions and reducers.

### `createReducer(schema, actions)`
Takes a schema and returns a reducer.

### `createActions(schema)`
Takes a schema and returns action types and actions creators.

```js
const actions = createActions(mySchema);

{
    ADD,
    EDIT,
    REMOVE,
    LINK,
    UNLINK,
    REORDER_ENTITY,
    REORDER_LINK,
    add,
    remove,
    edit,
    link,
    unlink,
    reorderEntity,
    reorderLink
} = actions;
```

Action creators:

#### `add(entityType, entityId, entity?, index?)`

Adds an entity to state.  

State before:
```js
{
    comment: {
        entities: {},
        ids: []
    },
}
```

Action:
```js
reducer(state, add('comment', 'c1', { body: 'this is a comment' }))
```

State after:
```js
{
    comment: {
        entities: {
            c1: { body: 'this is a comment' } 
        },
        ids: ['c1']
    },
}
```

#### `remove(entityType, entityId, [deletableLinkedEntityTypes]?)`

Remove (delete) an entity from state. Optionally, pass a third argument containing a array of entity types;
any entities of these types that are linked to the entity-to-be-removed will also be removed.

State before:
```
{
    post: {
        entities: {
            p1: { 
                title: 'My First Post',
                commentIds: ['c1']  
            }
        },
        ids: ['p1']
    },
    comment: {
        entities: {
            c1: { 
                body: 'this is a comment',
                postId: 'p1' 
            }
        },
        ids: ['c1']
    },
}
```

Action:
```
// remove post p1 and and comments linked to it
reducer(state, remove('post', 'p1', ['comment']))
```

State after:
```
{
    post: {
        entities: {},
        ids: []
    },
    comment: {
        entities: {},
        ids: []
    },
    // ...
}
```

#### `edit(entityType, entityId, entity?}, options?)`
Edit an entity.

State before:
```
{
    comment: {
        entities: {
            c1: { body: 'this is a comment' } 
        },
        ids: ['c1']
    },
}
```

Actions:
```
reducer(state, edit('comment', 'c1', { body: 'This is an edited comment!' }))
```

State after:
```
{
    comment: {
        entities: {
            c1: { body: 'This is an edited comment!' } 
        },
        ids: ['c1']
    },
}
```

#### `link(entityType1, entityId1, entityType2, entityId2)`
Link two entities. Note, the entities must have a relation defined in the schema.

State before:
```
{
    post: {
        entities: {
            p1: { 
               title: 'My First Post'
            }
        },
        ids: ['p1']
    },
    comment: {
        entities: {
            c1: { 
                body: 'this is a comment', 
            }
        },
        ids: ['c1']
    },
}
```

Action:
```
reducer(state, link('post', 'p1', 'comment', 'c1'))
```

State after:
```
{
    post: {
        entities: {
            p1: { 
               title: 'My First Post',
               commentIds: ['c1']
            }
        },
        ids: ['p1']
    },
    comment: {
        entities: {
            c1: { 
                body: 'this is a comment',
                postId: 'p1' 
            }
        },
        ids: ['c1']
    },
}
```

#### `unlink(entityType1, entityId1, entityType2, entityId2)`
Unlink two entities.

State before:
```
{
    post: {
        entities: {
            p1: { 
               title: 'My First Post',
               commentIds: ['c1']
            }
        },
        ids: ['p1']
    },
    comment: {
        entities: {
            c1: { 
                body: 'this is a comment',
                postId: 'p1' 
            }
        },
        ids: ['c1']
    },
}
```

Action:
```
reducer(state, link('post', 'p1', 'comment', 'c1'))
```

State after:
```
{
    post: {
        entities: {
            p1: { 
               title: 'My First Post',
               commentIds: []
            }
        },
        ids: ['p1']
    },
    comment: {
        entities: {
            c1: { 
                body: 'this is a comment', 
                postId: null
            }
        },
        ids: ['c1']
    },
}
```

#### `reorderEntity(entityType, sourceIndex, destinationIndex)`
Reorder an entity.

State before
```
{
    post: {
        entities: {
            p1: {},
            p2: {}
        },
        ids: ['p1', 'p2']
    }
}
```

Action:
```
reducer(state, reorderEntity('post', 0, 1))
```

State before
```
{
    post: {
        entities: {
            p1: {},
            p2: {}
        },
        ids: ['p2', 'p1']
    }
}
```

#### `reorderLink(entityType, entityId, foreignEntityType, sourceIndex, destinationIndex, destinationEntityId,)`
Reorder an entity in respect to another entity. The entity can be moved within the entity it is attached to
or moved to another entity.

State before: 
```
{
    post: {
        entities: {
            p1: { 
               title: 'My First Post',
               commentIds: ['c1', 'c2']
            },
            p2: {
                title: 'Another Post',
               commentIds: ['c3']
            }
        },
        ids: ['p1', 'p2']
    },
    comment: {
        entities: {
            c1: { postId: 'p1' },
            c2: { postId: 'p1' },
            c3: { postId: 'p2' }
        },
        ids: ['c1', 'c2', 'c3']
    },
}
```

Action:
```
// in post p2, take the comment at index 0, and move to index 1 of p1's comments
reducer(state, reorderLink('post', 'p2', 'comment', 0, 1, 'p1'))
```

State after:
```
{
    post: {
        entities: {
            p1: { 
               title: 'My First Post',
               commentIds: ['c1', 'c3', 'c2']
            },
            p2: {
                title: 'Another Post',
               commentIds: []
            }
        },
        ids: ['p1', 'p2']
    },
    comment: {
        entities: {
            c1: { postId: 'p1' },
            c2: { postId: 'p1' },
            c3: { postId: 'p1' }
        },
        ids: ['c1', 'c2', 'c3']
    },
}
```

### Selectors
There are four simple selectors that help get items from the entity state. 
More complex selectors are current not available, but you can use these simple
selectors to write your own. 

#### `getEntityState(state, { entityType })`
Returns the entities and ids of an entity type.

i.e.:
```js
{ 
    entities: {}, 
    ids: [] 
}
```

#### `getEntities(state, { entityType })`
Returns the entities of an entity type in the form of an object mapping id to entity.

i.e.:
```js
{
    p1: {},
    p2: {},
    // ...
}
``` 

#### `getIds(state, { entityType })`
Returns the ids of an entity type in the form of an array of ids.

i.e.:
```js
['p1', 'p2']
```

### `getEntity(state, { entityType, entityId })`
Returns an entity by entity type and id.
