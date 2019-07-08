// model
import { Model } from './model';
import { State, Type, Id } from './model/resource';

// actions
import { Action, Actions } from './actions';
import { Action as InputAddAction } from './actions/add';
import { Action as InputRemoveAction } from './actions/remove';

// interceptors
import {
  filterMap as filterMapResourcesByExistence,
  filterObject as filterObjectResourcesByExistence
} from './interceptors/filter-by-existence';
import convertToPrimitives, {
  InputAction as ConvertToPrimitivesInputAction,
  OutputAction as ConvertToPrimitivesOutputAction
} from './interceptors/on-add/convert-to-primitives';
import relate, { Action as RelatableAction } from './interceptors/on-add/relate';
import unrelate, { Action as UnrelatableAction } from './interceptors/on-remove/unrelate';
import { groupMapsByType, groupObjectsByType } from './interceptors/group-by-type';


export default (model: Model, state: State, action: Action, allActions: Actions): Action => {
  if (action.type === allActions.ADD) {
    action = onAdd(model, state, action as InputAddAction);
  }

  return action;
}


export type OutputAddAction = ConvertToPrimitivesOutputAction;
export const onAdd = (model: Model, state: State, inputAction: InputAddAction): OutputAddAction => {
  let intercepted;

  intercepted = filterMapResourcesByExistence(model, state, inputAction, false);
  intercepted = relate(model, state, intercepted as RelatableAction);
  intercepted = groupMapsByType(intercepted);
  intercepted = convertToPrimitives(model, intercepted as ConvertToPrimitivesInputAction);

  return intercepted;
};


// todo: remove this:
export interface OutputRemoveAction {
  type: string,
  resources: {
    [type in Type]: {
      [id in Id]: {
        resourceType: Type,
        resourceId: Id
      }
    }
  }
}
export const onRemove = (model: Model, state: State, inputAction: InputRemoveAction): OutputRemoveAction => {
  let intercepted;

  intercepted = filterObjectResourcesByExistence(model, state, inputAction, true);
  intercepted = unrelate(model, state, intercepted as UnrelatableAction);
  intercepted = groupObjectsByType(intercepted);

  return intercepted;
};
