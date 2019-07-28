import { Options, defaultOptions } from './options';
import { Schema, Entities } from './schema';
import { makeActions } from './actions';
import { makeSelectors } from './selectors';
import { makeInterceptor } from './interceptor';
import { makeRootReducer } from './reducer';

export default (schema: Schema, options: Options = defaultOptions) => {
  const entities = new Entities(schema);

  const {
    creators: actionCreators,
    types: actionTypes,
  } = makeActions(entities, options.namespace);

  const selectors = makeSelectors(entities);
  const interceptor = makeInterceptor(entities, selectors, actionTypes);
  const reducer = makeRootReducer(entities, actionTypes, interceptor);
  const emptyState = entities.getEmptyState();

  return {
    actionCreators,
    actionTypes,
    reducer,
    selectors,
    emptyState
  };
}
