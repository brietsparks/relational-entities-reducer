import { Type as ResourceType, EntityState } from '../interfaces';
import { Reducer, Action } from './interfaces';

import { makeResourcesReducer } from './resources';
import { makeIdsReducer } from './ids';

export const emptyState = {
  resources: {},
  ids: []
};

export const makeEntityReducer = (resourceType: ResourceType): Reducer<EntityState> => {
  const resourcesReducer = makeResourcesReducer(resourceType);
  const idsReducer = makeIdsReducer(resourceType);

  return (state: EntityState = emptyState, action: Action): EntityState => ({
    resources: resourcesReducer(state.resources, action),
    ids: idsReducer(state.ids, action)
  });
};
