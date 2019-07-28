import { Id, Index, RelationKey, RelationName, Type } from '../interfaces';
import { Entities } from '../schema';
import { Namespace } from '../options';
import { validateIndex, validateRelation, validateResourceId, validateResourceType } from './validation';

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

export const makeReindexRelated = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('REINDEX_RELATED');

  const creator = (
    resourceType: Type,
    resourceId: Id,
    relation: RelationKey|RelationName,
    source: Index,
    destination: Index
  ) => {
    validateResourceType(resourceType, entities);
    validateResourceId(resourceId);
    validateRelation(entities, resourceType, relation);
    validateIndex(source);
    validateIndex(destination);

    if (destination < 0) {
      destination = 0;
    }

    return {
      type: actionType,
      resourceType,
      resourceId,
      relation,
      source,
      destination
    };
  };

  return {
    type: actionType,
    creator
  }
};
