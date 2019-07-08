import { Model } from '../model';
import { State, Type } from '../interfaces';
import { Actions, Action } from '../actions';
import interceptor from '../interceptor';
import { createCollectionReducer, Reducer as CollectionReducer } from './collection';

export type CollectionReducerMap = { [entityType in Type]: CollectionReducer };

export interface Reducer {
  (state: State | undefined, action: Action): State
}

export const createReducer = (model: Model, allActions: Actions): Reducer => {
  const emptyState = model.getEmptyState();

  const reducerMap = model.getEntityTypes().reduce((reducerMap, entityType) => {
    reducerMap[entityType] = createCollectionReducer(entityType, allActions);
    return reducerMap;
  }, {} as CollectionReducerMap);

  return (state = emptyState, action) => {
    const interceptedAction = interceptor(model, state, action, allActions);

    return Object.keys(reducerMap).reduce((reducedState, stateKey) => {
      const reducer = reducerMap[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], interceptedAction);
      return reducedState;
    }, {} as State)
  }
};
