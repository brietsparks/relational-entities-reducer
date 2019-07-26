import { Type, Index } from '../interfaces';
import { Entities } from '../schema';
import { Namespace } from '../options';
import { validateIndex, validateResourceType } from './validation';

export interface Action {
  type: string,
  resourceType: Type,
  source: Index,
  destination: Index
}

export interface Creator {
  (type: Type, source: Index, destination: Index): Action
}

export const makeReindex = (entities: Entities, namespace: Namespace) => {
  const actionType = namespace('REINDEX');

  const creator = (resourceType: Type, source: Index, destination: Index) => {
    validateResourceType(resourceType, entities);
    validateIndex(source);
    validateIndex(destination);

    return ({
      type: actionType,
      resourceType,
      source,
      destination
    });
  };

  return {
    type: actionType,
    creator
  }
};
