import { Id, Index, RelationKey, RelationName, Type } from '../interfaces';

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
    type: Type,
    id: Id,
    relation: RelationKey | RelationName,
    source: Index,
    destination: Index
  ): Action
}
