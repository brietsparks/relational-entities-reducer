import { Entities } from '../schema';
import { State, Action as RawAction } from '../interfaces';
import { ActionTypes, Reducer, EntityReducerMap } from './interfaces';
import { Interceptor } from '../interceptor';
import { makeEntityReducer } from './entity';

export const makeRootReducer = (
  entities: Entities,
  actionTypes: ActionTypes,
  interceptor: Interceptor
): Reducer<State> => {
  const emptyState = entities.getEmptyState();

  const reducerMap = entities.getTypes().reduce((reducerMap, entityType) => {
    reducerMap[entityType] = makeEntityReducer(entityType, actionTypes);
    return reducerMap;
  }, {} as EntityReducerMap);

  return (state: State = emptyState, action: RawAction ) => {
    if (!Object.values(actionTypes).includes(action.type)) {
      return state;
    }

    const transformedAction = interceptor(state, action);

    return Object.keys(reducerMap).reduce((reducedState, stateKey) => {
      const reducer = reducerMap[stateKey];
      reducedState[stateKey] = reducer(state[stateKey], transformedAction);
      return reducedState;
    }, {} as State)
  }
};
