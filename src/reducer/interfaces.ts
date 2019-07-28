import {
  Type, EntityState,
  OperationsByType as OperationsByResourceType,
} from '../interfaces';

export {
  ActionTypes
} from '../actions'

export interface OperationsAction {
  type: string,
  operations: OperationsByResourceType
}

export interface Reducer<State> {
  // todo: find a better type for action
  (state: State|undefined, action: any): State
}

export type EntityReducerMap = { [entityType in Type]: Reducer<EntityState> };

