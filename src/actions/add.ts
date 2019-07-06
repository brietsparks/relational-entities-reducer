import { Namespace } from '../options';
import { Type, Id, Data, makeCompositeIdString, CompositeIdString, Fkey } from '../model/resource';
import { Model } from '../model';
import { validateBatchItem } from './validation';
import { Action as GenericAction } from '.';

export type Options = { index?: number };

// inputs
export interface Resource {
  resourceType: Type;
  resourceId: Id;
  data?: Data;
  options?: Options;
}

export type InputObject = Resource;
export type InputTuple = [Type, Id, Data?, Options?];
export type InputResource = InputObject | InputTuple;
export type InputResources = InputResource[];

// outputs
export type OutputResources = Map<CompositeIdString, Resource>

export interface Action extends GenericAction {
  resources: OutputResources,
}
export interface Creator {
  (...p: InputResources): Action
}

export const makeAdd = (namespace: Namespace, model: Model) => {
  const TYPE = namespace('ADD');

  const creator: Creator = (...resources: InputResources): Action => {
    const outputResources: OutputResources = new Map();

    resources.forEach((resource: InputResource) => {
      // convert tuple to object
      if (Array.isArray(resource)) {
        const [ resourceType, resourceId, data, options ] = resource;
        resource = { resourceType, resourceId, data, options };
      }

      const { resourceType, resourceId, data, options } = resource;

      // validate
      validateBatchItem(model, resource);

      // default values
      resource.data = data ? convertRelatedIdsToSets(resourceType, data, model) : {};
      resource.options = options || {};

      /* add to outputs */
      const compositeIdString = makeCompositeIdString(resourceType, resourceId);

      outputResources.set(compositeIdString, resource)
    });

    return {
      type: TYPE,
      resources: outputResources
    };
  };

  return { TYPE, creator };
};

type FkData = Record<Fkey, Set<Id>>


export const convertRelatedIdsToSets = (resourceType: Type, data: Data, model: Model) => {
  const fks = model.getEntity(resourceType).getFksMany();

  const fkData: FkData = {};

  fks.forEach(fk => {
    const relatedIds: Id[] = data[fk];

    if (relatedIds) {
      fkData[fk] = new Set(relatedIds);
    }
  });

  return { ...data, ...fkData };
};
