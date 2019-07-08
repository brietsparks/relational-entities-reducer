// model
import { Model } from './model';
import {
  State,
  ResourceCollectionMapByCid,
  ResourcePointerObject,
  ActionResource,
  ResourceCollectionsByType,
  ResourceCollectionObjectById, ResourceCollectionObjectByCid, IdsByType
} from './interfaces';

// actions
import { Action, Actions } from './actions';
import { Action as InputAddAction } from './actions/add';
import { Action as InputRemoveAction } from './actions/remove';

// interceptors
import { filterMap as filterMapResourcesByExistence, filterObject as filterObjectResourcesByExistence } from './interceptors/filter-by-existence';
import convertToPrimitives, * as fromConvertToPrimitives from './interceptors/on-add/convert-to-primitives';
import relate, * as fromRelate from './interceptors/on-add/relate';
import removeRelated, * as fromRemoveRelated from './interceptors/on-remove/remove-related';
import { groupMapsByType, groupObjectsByType } from './interceptors/group-by-type';

export default (model: Model, state: State, action: Action, allActions: Actions): Action => {
  if (action.type === allActions.ADD) {
    action = onAdd(model, state, action as InputAddAction);
  }

  if (action.type === allActions.REMOVE) {
    action = onRemove(model, state, action as InputRemoveAction);
  }

  return action;
}

interface OutputAddAction extends Action {
  resources: ResourceCollectionsByType<ResourceCollectionObjectById<ActionResource>>,
  ids: IdsByType
}
export const onAdd = (model: Model, state: State, inputAction: InputAddAction): OutputAddAction => {
  const filtered = filterMapResourcesByExistence(model, state, inputAction.resources, false);
  const interrelated = relate(model, state, filtered as ResourceCollectionMapByCid<ActionResource>);
  const grouped = groupMapsByType(interrelated);
  const [outputResources, outputIds] = convertToPrimitives(model, grouped as ResourceCollectionsByType<ResourceCollectionMapByCid<ActionResource>>);

  return {
    ...inputAction,
    resources: outputResources,
    ids: outputIds
  };
};

interface OutputRemoveAction extends Action {
  remove: ResourceCollectionsByType<ResourceCollectionObjectById<ResourcePointerObject>>
}
export const onRemove = (model: Model, state: State, inputAction: InputRemoveAction): OutputRemoveAction => {
  const filtered = filterObjectResourcesByExistence(model, state, inputAction.remove, true);
  const withRemovals = removeRelated(model, state, filtered as fromRemoveRelated.Resources);
  const grouped = groupObjectsByType(withRemovals);

  return {
    type: inputAction.type,
    remove: grouped
  };
};
