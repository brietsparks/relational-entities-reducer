import { Type, Index } from '../interfaces';

export interface Action {
  type: string,
  resourceType: Type,
  source: Index,
  destination: Index
}

export interface Creator {
  (type: Type, source: Index, destination: Index): Action
}
