import { Action as InputAddAction } from './actions/add';
import { Action, Actions } from './actions';
import { filterMap as filterMapResourcesByExistence } from './interceptors/filter-by-existence';
import relate, { Action as RelatedAction } from './interceptors/on-add/relate';
import convertToPrimitives, {
  InputAction as ConvertToPrimitivesInputAction,
  OutputAction as OutputAddAction
} from './interceptors/on-add/convert-to-primitives';
import { groupMapsByType } from './interceptors/group-by-type';
import { Model } from './model';
import { State } from './model/resource';

export default (model: Model, state: State, action: Action, allActions: Actions): Action => {
  if (action.type === allActions.ADD) {
    action = onAdd(model, state, action as InputAddAction);
  }

  return action;
}

export const onAdd = (model: Model, state: State, inputAction: InputAddAction): OutputAddAction => {
  let intercepted;

  intercepted = filterMapResourcesByExistence(model, state, inputAction, false);
  intercepted = relate(model, state, intercepted as RelatedAction);
  intercepted = groupMapsByType(intercepted);
  intercepted = convertToPrimitives(model, intercepted as ConvertToPrimitivesInputAction);

  return intercepted;
};
