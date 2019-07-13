import { RemoveOptions, Id, OpId, RemoveOperand, Type } from '../interfaces';

export interface Action {
  type: string,
  operands: Map<OpId, RemoveOperand>
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
