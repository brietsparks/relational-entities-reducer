import { RemoveOptions, Id, OpId, RemoveOperation, Type } from '../interfaces';
import { Entities } from '../schema';
import { Namespace } from '../options';
import { validateBatchItem } from './validation';
import { makeCidString } from '../util';
import { OP_REMOVE } from '../constants';

export interface Action {
  type: string,
  operations: Map<OpId, RemoveOperation>
}

export interface Creator {
  (...resources: Input[]): Action
}

interface InputObject {
  type: Type;
  id: Id;
  options?: RemoveOptions;
}
type InputTuple = [Type, Id, RemoveOptions?]
type Input = InputTuple | InputObject;

export const makeRemove = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('REMOVE');

  const creator: Creator = (...resources: Input[]) => {
    const operations = new Map<OpId, RemoveOperation>();

    resources.forEach(resource => {
      if (Array.isArray(resource)) {
        const [type, id, options] = resource;
        resource = { type, id, options };
      }

      const { type, id, options } = resource;

      validateBatchItem(entities, resource);

      const opId = makeCidString(type, id);
      const operation: RemoveOperation = {
        type,
        id,
        data: {},
        operator: OP_REMOVE,
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
  };
};
