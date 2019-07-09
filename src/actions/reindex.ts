import { Id, Type } from '../interfaces';
import { Namespace } from '../options';
import { Model } from '../model';
import { validateResourceType, validateResourceId, validateIndex } from './validation';

export interface Action {
  type: string,
  resourceType: Type,
  sourceIndex: number,
  destinationIndex: number,
}

export interface Creator {
  (resourceType: Type, sourceIndex: number, destinationIndex: number): Action
}

export const makeReindex = (namespace: Namespace, model: Model) => {
  const TYPE = namespace('REINDEX');

  const creator: Creator = (
    resourceType: Type,
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    validateResourceType(resourceType, model);
    validateIndex(sourceIndex);
    validateIndex(destinationIndex);

    return {
      type: TYPE,
      resourceType,
      sourceIndex,
      destinationIndex,
    }
  };

  return { TYPE, creator }
};


