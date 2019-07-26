import { EditOperation, OpId, Type, Id, Data, EditOptions } from '../interfaces';
import { Entities } from '../schema';
import { Namespace } from '../options';
import { validateBatchItem } from './validation';
import { makeCidString } from '../util';
import { OP_EDIT } from '../constants';

export interface Action {
  type: string,
  operations: Map<OpId, EditOperation>
}

export interface Creator {
  (...resources: Input[]): Action
}

interface InputObject {
  type: Type,
  id: Id,
  data: Data
  options?: EditOptions
}
type InputTuple = [Type, Id, Data, EditOptions?];
type Input = InputObject | InputTuple;

export const makeEdit = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('EDIT');

  const creator: Creator = (...resources: Input[]) => {
    const operations = new Map<OpId, EditOperation>();

    resources.forEach(resource => {
      if (Array.isArray(resource)) {
        const [type, id, data, options] = resource;
        resource = { type, id, data, options };
      }

      const { type, id, data, options } = resource;

      validateBatchItem(entities, resource);

      const opId = makeCidString(type, id);
      const operation: EditOperation = {
        type,
        id,
        data,
        operator: OP_EDIT,
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
