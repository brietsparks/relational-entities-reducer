import { Model } from '../model';

import { Data, Id, ResourcesState, Type } from '../interfaces';
import { isObject } from '../util';

interface Actions { ADD: string }
interface Action { type: string }
export type Reducer = (state: ResourcesState|undefined, action: Action) => ResourcesState;

interface AddAction extends Action{
  resources: {
    [type in Type]: {
      [id in Id]: AddableResource
    }
  }
}

interface AddableResource {
  resourceType: Type,
  resourceId: Id,
  data: Data
}

export const createResourcesReducer = (type: Type, actions: Actions): Reducer => {
  const emptyState = Model.getEmptyResourcesState();

  return (state: ResourcesState = emptyState, action) => {
    switch (action.type) {
      case actions.ADD: {
        const addAction = action as AddAction;

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
      default:
        return state;
    }
  }
};
