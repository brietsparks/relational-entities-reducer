import { Id, Type } from '../interfaces';
import { Namespace } from '../options';
import { Model } from '../model';

export const makeReindexRelatedResource = (namespace: Namespace, model: Model) => {
  const reindexRelatedResource = (
    resourceType: Type,
    resourceId: Id,
    relatedType: Type,
    sourceIndex: number,
    destinationIndex: number
  ) => {

  };
};
