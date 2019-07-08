import { Model } from '../model';

import {
  Data,
  Id,
  ResourcesState,
  Type,
  ResourceCollectionsByType,
  ResourceCollectionObjectById,
  ResourcePointerObject,
} from '../interfaces';
import { isObject } from '../util';

interface Actions {
  ADD: string,
  REMOVE: string
}

interface Action {
  type: string
}

export type Reducer = (state: ResourcesState|undefined, action: Action) => ResourcesState;

interface ResourcesAction<R> extends Action {
  resources: ResourceCollectionsByType<ResourceCollectionObjectById<R>>
}

interface AddableResource extends ResourcePointerObject {
  data: Data
}

export const createResourcesReducer = (type: Type, actions: Actions): Reducer => {
  const emptyState = Model.getEmptyResourcesState();

  return (state: ResourcesState = emptyState, action) => {
    switch (action.type) {
      case actions.ADD: {
        const addAction = action as ResourcesAction<AddableResource>;

        const resources = addAction.resources[type];

        if (!isObject(resources)) {
          return state;
        }

        const addableResources: ResourcesState = {};

        Object.entries(resources).forEach(([resourceId, resource]) => {
          addableResources[resourceId] = resource.data;
        });

        return {...state, ...addableResources};
      }
      case actions.REMOVE:
        const removeAction = action as ResourcesAction<ResourcePointerObject>;

        const resources = removeAction.resources[type];

        if (!isObject(resources)) {
          return state;
        }

        const newState = { ...state };

        Object.keys(resources).forEach(deletableId => delete newState[deletableId]);

        return newState;
      default:
        return state;
    }
  }
};
