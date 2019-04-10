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

`npm install relational-entities-reducer`

Install with yarn:

`yarn add relational-entities-reducer`

## Usage

This library strives for simplicity.

1. Define a schema of your entity relationships:
    
    ```
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

2. Use the schema to make the actions and reducers
    ```
    import { createReducer, createActions, selectors} from 'relational-entities-reducer';
    
    /* ACTIONS */
    const myEntityActions = createActions(modelSchema);
    export const addEntity = myEntityActions.add;
    export const removeEntity = myEntityActions.remove;
    export const editEntity = myEntityActions.edit;
    export const reorderEntity = myEntityActions.reorderEntity;
    
    /* REDUCER */
    const myEntityReducer = createReducer(modelSchema, modelActions);
    
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
3. Use the actions to write to the state, and use selectors to read from the state.
In this example, the state will look like:

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
        categories: {
            entities: {},
            ids: []
        } 
    }
    ```

## API
Todo
