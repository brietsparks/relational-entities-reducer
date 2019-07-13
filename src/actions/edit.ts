import { EditOperand, OpId, Type, Id, Data } from '../interfaces';

export interface Action {
  type: string,
  operands: Map<OpId, EditOperand>
}

export interface Creator {
  (...resources: Input[]): Action
}

interface InputObject {
  type: Type,
  id: Id,
  data: Data
}
type InputTuple = [Type, Id, Data];
type Input = InputObject | InputTuple;
