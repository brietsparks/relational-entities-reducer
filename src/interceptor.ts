// model
import { Model } from './model';
import {
  State,
  Type,
  Id,
  ResourceCollectionMapByCid,
  ResourceCollectionMapById,
  ResourcePointerObject,
  ActionResource,
  ResourceCollectionsByType,
  ResourceCollectionObjectById, ResourceCollectionObjectByCid
} from './interfaces';

// actions
import { Action, Actions } from './actions';

// interceptors
import { filterMap as filterMapResourcesByExistence, filterObject as filterObjectResourcesByExistence } from './interceptors/filter-by-existence';
import convertToPrimitives, * as fromConvertToPrimitives from './interceptors/on-add/convert-to-primitives';
import relate, * as fromRelate from './interceptors/on-add/relate';
import unrelate, * as fromUnrelate from './interceptors/on-remove/unrelate';
import { groupMapsByType, groupObjectsByType } from './interceptors/group-by-type';

export default (model: Model, state: State, action: Action, allActions: Actions): Action => {
  if (action.type === allActions.ADD) {
    action = onAdd(model, state, action as InputAddAction);
  }

  return action;
}

interface InputAddAction extends Action {
  resources: ResourceCollectionMapByCid<ResourcePointerObject>
}
interface OutputAddAction extends Action {
  resources: ResourceCollectionsByType<ResourceCollectionObjectById<ActionResource>>
}
export const onAdd = (model: Model, state: State, inputAction: InputAddAction): OutputAddAction => {
  let intercepted;

  intercepted = filterMapResourcesByExistence(model, state, inputAction, false);
  intercepted = relate(model, state, intercepted as fromRelate.InputAction);
  intercepted = groupMapsByType(intercepted);
  intercepted = convertToPrimitives(model, intercepted as fromConvertToPrimitives.InputAction);

  return intercepted;
};


interface InputRemoveAction extends Action {
  resources: ResourceCollectionObjectByCid<ResourcePointerObject>
}
interface OutputRemoveAction extends Action {
  resources: ResourceCollectionsByType<ResourceCollectionObjectById<ResourcePointerObject>>
}
export const onRemove = (model: Model, state: State, inputAction: InputRemoveAction): OutputRemoveAction => {
  let intercepted;

  intercepted = filterObjectResourcesByExistence(model, state, inputAction, true);
  intercepted = unrelate(model, state, intercepted as fromUnrelate.InputAction);
  intercepted = groupObjectsByType(intercepted);

  return intercepted;
};
