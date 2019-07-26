import { Type as ResourceType, IdsState, AddOperation, Action } from '../interfaces';
import { Reducer, ActionTypes, OperationsAction } from './interfaces';
import { OP_ADD, OP_REMOVE } from '../constants';
import { isObjectLiteral, isNonNegativeInteger, arrayMove } from '../util';
import { ReindexAction } from '../actions';

export const makeIdsReducer = (resourceType: ResourceType, actionTypes: ActionTypes): Reducer<IdsState> => {
  return (state: IdsState = [], action: Action) => {
    if (action.type === actionTypes.REINDEX) {
      const reindexAction = action as ReindexAction;

      if (reindexAction.resourceType !== resourceType) {
        return state;
      }

      const newState = [...state];

      arrayMove(newState, reindexAction.source, reindexAction.destination);

      return newState;
    }

    const opAction = action as OperationsAction;

    if (!isObjectLiteral(opAction.operations)) {
      return state;
    }

    const operations = opAction.operations[resourceType];

    if (!(operations instanceof Map) || operations.size < 1) {
      return state;
    }

    let newState = [ ...state ];

    operations.forEach(operation => {
      if (operation.type !== resourceType) {
        return;
      }

      if (operation.operator === OP_ADD) {
        const addOperation = operation as AddOperation;

        if (isNonNegativeInteger(addOperation.options.index)) {
          newState.splice(addOperation.options.index, 0, addOperation.id);
        } else {
          newState.push(addOperation.id);
        }

        return;
      }

      if (operation.operator === OP_REMOVE) {
        newState = newState.filter(id => id !== operation.id);
        return;
      }
    });

    return newState;
  }
};
