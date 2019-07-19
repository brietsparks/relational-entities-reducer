import { RemoveOptions, Id, OpId, RemoveOperation, Type } from '../interfaces';

export interface Action {
  type: string,
  operations: Map<OpId, RemoveOperation>
}

export interface Creator {
  (...resources: []): Action
}

interface InputObject {
  type: Type;
  id: Id;
  options?: RemoveOptions;
}
type InputTuple = [Type, Id, RemoveOptions?]
type Input = InputTuple | InputObject;
