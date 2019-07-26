import Model from './model';
import { Entities } from './schema';
import { Selectors, State, Action as RawAction } from './interfaces';
import { Action as TransformedAction, ActionTypes } from './reducer/interfaces';
import { AddAction, RemoveAction, LinkAction, UnlinkAction } from './actions';
import {
  transformAddOperations, transformRemoveOperations,
  transformLinkDefinitions, transformUnlinkDefinitions,
  groupOperationsByType
} from './transformers';

export interface Interceptor {
  (state: State, action: RawAction): RawAction|TransformedAction;
}

export const makeInterceptor = (entities: Entities, selectors: Selectors, actionTypes: ActionTypes): Interceptor => {
  return (state: State, action: RawAction) => {
    const model = new Model(entities, selectors, state);

    let operations;
    if (action.type === actionTypes.ADD) {
      const addAction = action as AddAction;
      operations = transformAddOperations(model, addAction.operations);
      operations = groupOperationsByType(operations);
      return { ...addAction, operations };
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

    return action;
  };
};
