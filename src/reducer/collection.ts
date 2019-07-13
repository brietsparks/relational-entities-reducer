import { createResourcesReducer } from './resources';
import { createIdsReducer } from './ids';
import { Type, CollectionState } from '../interfaces';
import { Model } from '../model';

export interface Actions {
  ADD: string,
  REMOVE: string,
  EDIT: string,
  REINDEX: string,
  REINDEX_RELATED: string,
}

export interface Action {
  type: string
}

export type Reducer = (state: CollectionState|undefined, action: Action) => CollectionState;

export const createCollectionReducer = (type: Type, actions: Actions): Reducer => {
  const resourcesReducer = createResourcesReducer(type, actions);
  const idsReducer = createIdsReducer(type, actions);

  const emptyState = Model.getEmptyCollectionState();

  return (state = emptyState, action) => ({
    resources: resourcesReducer(state.resources, action),
    ids: idsReducer(state.ids, action)
  });
};
