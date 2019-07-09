import { Model } from '../model';

import {
  Data,
  Id,
  ResourcesState,
  Type,
  ResourceCollectionsByType,
  ResourceCollectionObjectById,
  ResourcePointerObject, Fkey,
} from '../interfaces';
import { arraymove, isObject } from '../util';

interface Actions {
  ADD: string,
  REMOVE: string,
  EDIT: string,
  REINDEX_RELATED: string
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

interface ReindexRelatedAction extends Action {
  resourceType: Type,
  resourceId: Id,
  fk: Fkey,
  sourceIndex: number,
  destinationIndex: number,
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
      case actions.REMOVE: {
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
      }
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
      case actions.REINDEX_RELATED: {
        const reindexRelatedAction = action as ReindexRelatedAction;

        if (type !== reindexRelatedAction.resourceType) {
          return state;
        }

        const { resourceId, fk, sourceIndex, destinationIndex } = reindexRelatedAction;

        const resource = state[resourceId];

        if (!isObject(resource)) {
          return state;
        }

        const relatedIds = resource[fk];

        if (!Array.isArray(relatedIds)) {
          return state;
        }

        const newRelatedIds = [...relatedIds];
        arraymove(newRelatedIds, sourceIndex, destinationIndex);

        return {
          ...state,
          [resourceId]: { ...state[resourceId], [fk]: newRelatedIds }
        }
      }
      default:
        return state;
    }
  }
};
