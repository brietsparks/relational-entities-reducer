import { Type as ResourceType, IdsState, AddOperation } from '../interfaces';
import { Reducer, Action } from './interfaces';
import { OP_ADD, OP_REMOVE } from '../constants';
import { isObjectLiteral, isNonNegativeInteger } from '../util';

export const makeIdsReducer = (resourceType: ResourceType): Reducer<IdsState> => {
  return (state: IdsState = [], action: Action) => {
    if (!isObjectLiteral(action.operations)) {
      return state;
    }

    const operations = action.operations[resourceType];

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
