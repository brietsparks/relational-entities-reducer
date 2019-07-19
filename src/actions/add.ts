import { AddOperation, OpId, Data, AddOptions, Type, Id } from '../interfaces';

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
