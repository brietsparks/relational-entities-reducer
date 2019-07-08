import { Model } from '../model';
import {
  IdsState,
  Type,
  IdsByType,
  ResourceCollectionsByType,
  ResourceCollectionObjectById,
  ActionResource, RelationRemovalSchema
} from '../interfaces';

import { isObject } from '../util';

interface Actions { ADD: string, REMOVE: string }
interface Action { type: string }
export type Reducer = (state: IdsState|undefined, action: Action) => IdsState;

interface AddAction extends Action {
  ids: IdsByType
}


interface RemoveActionOptions {
  removeRelated?: RelationRemovalSchema
}
interface RemoveAction extends Action {
  resources: ResourceCollectionsByType<ResourceCollectionObjectById<ActionResource<RemoveActionOptions>>>
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

        const resourcesOfType = removeAction.resources[type];

        if (!isObject(resourcesOfType)) {
          return state;
        }

        return state.filter(id => !resourcesOfType[id]);
      }
      default:
        return state;
    }
  }
};
