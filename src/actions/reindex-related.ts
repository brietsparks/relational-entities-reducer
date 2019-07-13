import { Id, Index, RelationName, Type } from '../interfaces';

export interface Action {
  type: string,
  resourceType: Type,
  resourceId: Id,
  relation: RelationName | RelationName,
  source: Index,
  destination: Index
}

export interface Creator {
  (
    type: Type, resourceType: Type, resourceId: Id,
    relation: RelationName | RelationName,
    source: Index, destination: Index
  ): Action
}
