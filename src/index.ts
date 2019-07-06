import { Options, defaultOptions } from './options';
import { Model, ModelSchema } from './model';
import { createActions } from './actions';
import { createReducer } from './reducer';
import * as selectors from './selectors';

export default (schema: ModelSchema, options: Options = defaultOptions) => {
  const model = new Model(schema);

  const actions = createActions(options.namespace, model);
  const reducer = createReducer(model, actions);
  const emptyState = model.getEmptyState();

  return {
    actions,
    reducer,
    emptyState,
    selectors
  };
}
