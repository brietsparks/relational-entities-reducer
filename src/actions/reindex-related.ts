import { Fkey, Id, Type } from '../interfaces';
import { Namespace } from '../options';
import { Model } from '../model';
import { validateResourceType, validateResourceId, validateIndex, validateFk } from './validation';

export interface Action {
  type: string;
  resourceType: Type,
  resourceId: Id,
  fk: Fkey,
  sourceIndex: number,
  destinationIndex: number,
}

export interface Creator {
  (
    resourceType: Type,
    resourceId: Id,
    fk: Fkey,
    sourceIndex: number,
    destinationIndex: number,
  ): Action
}

export const makeReindexRelated = (namespace: Namespace, model: Model) => {
  const TYPE = namespace('REINDEX_RELATED');

  const creator: Creator = (
    resourceType: Type,
    resourceId: Id,
    fk: Fkey,
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    validateResourceType(resourceType, model);
    validateResourceId(resourceId);
    validateFk(model, resourceType, fk);
    validateIndex(sourceIndex);
    validateIndex(destinationIndex);

    return {
      type: TYPE,
      resourceType,
      resourceId,
      fk,
      sourceIndex,
      destinationIndex,
    };
  };

  return { TYPE, creator }
};


