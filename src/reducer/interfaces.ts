import {
  Type, EntityState,
  OperationsByType as OperationsByResourceType
} from '../interfaces';

export interface Action {
  type: string,
  operations: OperationsByResourceType
}

export interface Reducer<State> {
  (state: State|undefined, action: Action): State
}

export interface ActionTypes {
  ADD: string,
  REMOVE: string,
  LINK: string,
  UNLINK: string,
  REINDEX: string
}

export type EntityReducerMap = { [entityType in Type]: Reducer<EntityState> };

