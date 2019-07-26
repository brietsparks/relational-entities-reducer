import { AddOperation, OpId, Data, AddOptions, Type, Id } from '../interfaces';
import { Namespace } from '../options';
import { Entities } from '../schema';
import { validateBatchItem } from './validation';
import { makeCidString } from '../util';
import { OP_ADD } from '../constants';

export interface Action {
  type: string;
  operations: Map<OpId, AddOperation>
}

export interface Creator {
  (...resources: Input[]): Action
}

interface InputObject {
  type: Type;
  id: Id;
  data?: Data;
  options?: AddOptions;
}
type InputTuple = [Type, Id, Data?, AddOptions?]
type Input = InputTuple | InputObject;

export const makeAdd = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('ADD');

  const creator: Creator = (...resources: Input[]) => {
    const operations = new Map<OpId, AddOperation>();

    resources.forEach(resource => {
      if (Array.isArray(resource)) {
        const [type, id, data, options] = resource;
        resource = { type, id, data, options };
      }

      const { type, id, data, options } = resource;

      validateBatchItem(entities, resource);

      const opId = makeCidString(type, id);
      const operation: AddOperation = {
        type,
        id,
        data: data || {},
        operator: OP_ADD,
        options: options || {}
      };

      operations.set(opId, operation);
    });

    return {
      type: actionType,
      operations
    }
  };

  return {
    creator,
    type: actionType
  }
};
