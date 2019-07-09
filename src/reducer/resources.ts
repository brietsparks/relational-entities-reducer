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
  REMOVE: string,
  EDIT: string
}

interface Action {
  type: string
}

export type Reducer = (state: ResourcesState|undefined, action: Action) => ResourcesState;

interface ConstructiveAction extends Action {
  resources: ResourceCollectionsByType<ResourceCollectionObjectById<ConstructiveResource>>
}

interface ConstructiveResource extends ResourcePointerObject {
  data: Data
}

interface RemoveAction extends Action {
  remove: ResourceCollectionsByType<ResourceCollectionObjectById<ResourcePointerObject>>,
  edit: ResourceCollectionsByType<ResourceCollectionObjectById<ConstructiveResource>>
}

export const createResourcesReducer = (type: Type, actions: Actions): Reducer => {
  const emptyState = Model.getEmptyResourcesState();

  return (state: ResourcesState = emptyState, action) => {
    switch (action.type) {
      case actions.ADD: {
        const addAction = action as ConstructiveAction;

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
        const newState = { ...state };

        const removeAction = action as RemoveAction;
        const removables = removeAction.remove[type];
        const editables = removeAction.edit[type];

        if (isObject(removables)) {
          Object.keys(removables).forEach(deletableId => delete newState[deletableId]);
        }

        if (isObject(editables)) {
          Object.entries(editables).forEach(([resourceId, resource]) => {
            newState[resourceId] = resource.data;
          });
        }

        return newState;
      case actions.EDIT: {
        const editAction = action as ConstructiveAction;

        const resources = editAction.resources[type];

        if (!isObject(resources)) {
          return state;
        }

        const newState = { ...state };

        Object.entries(resources).forEach(([resourceId, resource]) => {
          newState[resourceId] = { ...newState[resourceId], ...resource.data };
        });

        return newState;
      }
      default:
        return state;
    }
  }
};
