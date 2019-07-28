import Model from './model';
import { Entities } from './schema';
import { Selectors, State, Action } from './interfaces';
import { ActionTypes } from './actions';
import { AddAction, EditAction, RemoveAction, LinkAction, UnlinkAction, ReindexRelatedAction } from './actions';
import {
  transformAddOperations, transformRemoveOperations,
  transformLinkDefinitions, transformUnlinkDefinitions,
  transformReindexRelated, groupOperationsByType
} from './transformers';

export interface Interceptor {
  (state: State, action: Action): Action;
}

export const makeInterceptor = (entities: Entities, selectors: Selectors, actionTypes: ActionTypes): Interceptor => {
  return (state: State, action: Action) => {
    const model = new Model(entities, selectors, state);

    let operations;
    if (action.type === actionTypes.ADD) {
      const addAction = action as AddAction;
      operations = transformAddOperations(model, addAction.operations);
      operations = groupOperationsByType(operations);
      return { ...addAction, operations };
    }

    if (action.type === actionTypes.EDIT) {
      const editAction = action as EditAction;
      operations = groupOperationsByType(editAction.operations);
      return { ...editAction, operations };
    }

    if (action.type === actionTypes.REMOVE) {
      const removeAction = action as RemoveAction;
      operations = transformRemoveOperations(model, removeAction.operations);
      operations = groupOperationsByType(operations);
      return { ...removeAction, operations };
    }

    if (action.type === actionTypes.LINK) {
      const linkAction = action as LinkAction;
      operations = transformLinkDefinitions(model, linkAction.definitions);
      operations = groupOperationsByType(operations);
      return { ...linkAction, operations };
    }

    if (action.type === actionTypes.UNLINK) {
      const unlinkAction = action as UnlinkAction;
      operations = transformUnlinkDefinitions(model, unlinkAction.definitions);
      operations = groupOperationsByType(operations);
      return { ...unlinkAction, operations };
    }

    if (action.type === actionTypes.REINDEX_RELATED) {
      const reindexRelatedAction = action as ReindexRelatedAction;
      operations = transformReindexRelated(model, reindexRelatedAction);
      operations = groupOperationsByType(operations);
      return { ...reindexRelatedAction, operations };
    }

    return action;
  };
};
