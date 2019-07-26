import {
  Type, EntityState,
  OperationsByType as OperationsByResourceType,
  Action
} from '../interfaces';


export interface OperationsAction {
  type: string,
  operations: OperationsByResourceType
}

export interface Reducer<State> {
  // todo: find a better type for action
  (state: State|undefined, action: any): State
}

export interface ActionTypes {
  ADD: string,
  REMOVE: string,
  LINK: string,
  UNLINK: string,
  REINDEX: string,
  REINDEX_RELATED: string
}

export type EntityReducerMap = { [entityType in Type]: Reducer<EntityState> };

