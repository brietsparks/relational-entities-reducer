import { Model } from '../model';
import {
  IdsState,
  Type,
  IdsByType,
  ResourceCollectionsByType,
  ResourceCollectionObjectById,
  ActionResource, RelationRemovalSchema, Id
} from '../interfaces';

import { isObject, arraymove } from '../util';

interface Actions { ADD: string, REMOVE: string, REINDEX: string }
interface Action { type: string }
export type Reducer = (state: IdsState|undefined, action: Action) => IdsState;

interface AddAction extends Action {
  ids: IdsByType
}


interface RemoveActionOptions {
  removeRelated?: RelationRemovalSchema
}
interface RemoveAction extends Action {
  remove: ResourceCollectionsByType<ResourceCollectionObjectById<ActionResource<RemoveActionOptions>>>
}
interface ReindexAction extends Action {
  resourceType: Type,
  resourceId: Id,
  sourceIndex: number,
  destinationIndex: number,
}

export const createIdsReducer = (type: Type, actions: Actions): Reducer => {
  const emptyState = Model.getEmptyIdsState();

  return (state = emptyState, action: Action) => {
    switch (action.type) {
      case actions.ADD: {
        const addAction = action as AddAction;

        const addableIds = addAction.ids[type];

        if (!Array.isArray(addableIds)) {
          return state;
        }

        return [...state, ...addableIds];
      }
      case actions.REMOVE: {
        const removeAction = action as RemoveAction;

        const resourcesOfType = removeAction.remove[type];

        if (!isObject(resourcesOfType)) {
          return state;
        }

        return state.filter(id => !resourcesOfType[id]);
      }
      case actions.REINDEX: {
        const reindexAction = action as ReindexAction;

        if (reindexAction.resourceType !== type) {
          return state;
        }

        const newState = [...state];

        arraymove(newState, reindexAction.sourceIndex, reindexAction.destinationIndex);

        return newState;
      }
      default:
        return state;
    }
  }
};
