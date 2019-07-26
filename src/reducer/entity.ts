import { Type as ResourceType, EntityState, Action } from '../interfaces';
import { Reducer, ActionTypes } from './interfaces';

import { makeResourcesReducer } from './resources';
import { makeIdsReducer } from './ids';

export const emptyState = {
  resources: {},
  ids: []
};

export const makeEntityReducer = (resourceType: ResourceType, actionTypes: ActionTypes): Reducer<EntityState> => {
  const resourcesReducer = makeResourcesReducer(resourceType);
  const idsReducer = makeIdsReducer(resourceType, actionTypes);

  return (state: EntityState = emptyState, action: Action): EntityState => ({
    resources: resourcesReducer(state.resources, action),
    ids: idsReducer(state.ids, action)
  });
};
