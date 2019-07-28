import { Type as ResourceType, ResourcesState } from '../interfaces';
import { Reducer, OperationsAction } from './interfaces';
import { isObjectLiteral } from '../util';
import { OP_ADD, OP_EDIT, OP_REMOVE } from '../constants';

export const makeResourcesReducer = (resourceType: ResourceType): Reducer<ResourcesState> => {
  return (state: ResourcesState = {}, action: OperationsAction): ResourcesState => {
    if (!isObjectLiteral(action.operations)) {
      return state;
    }

    const operations = action.operations[resourceType];

    if (!(operations instanceof Map) || operations.size < 1) {
      return state;
    }

    let newState = { ...state };

    operations.forEach(operation => {
      if (operation.type !== resourceType) {
        return;
      }

      if (operation.operator === OP_ADD || operation.operator === OP_EDIT) {
        const { id } = operation;

        if (operation.operator === OP_ADD && newState[id]) {
          return;
        }

        if (operation.operator === OP_EDIT && !newState[id]) {
          return
        }

        newState = {
          ...newState,
          [id]: { ...newState[id], ...operation.data }
        };

        return;
      }

      if (operation.operator === OP_REMOVE) {
        delete newState[operation.id];
      }
    });

    return newState;
  };
};
