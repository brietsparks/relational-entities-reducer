import { Namespace } from '../options';
import { Model } from '../model';
import { validateBatchItem } from './validation';
import { Action as GenericAction } from '.';
import { Type, Id, Data, Fkey, ResourcePointerObject, ActionResource, ResourceCollectionMapByCid } from '../interfaces';
import { makeCompositeId } from '../util';

export interface Action extends GenericAction {
  resources: OutputResources,
}
export interface Creator {
  (...p: InputResources): Action
}

type Options = { index?: number };

// inputs
interface InputResourceObject extends ResourcePointerObject {
  data?: Data;
  options?: Options;
}
type InputResourceTuple = [Type, Id, Data?, Options?];
type InputResource = InputResourceObject | InputResourceTuple;
type InputResources = InputResource[];

// outputs
type OutputResource = ActionResource;
type OutputResources = ResourceCollectionMapByCid<OutputResource>

export const makeAdd = (namespace: Namespace, model: Model) => {
  const TYPE = namespace('ADD');

  const creator: Creator = (...resources: InputResources): Action => {
    const outputResources: OutputResources = new Map();

    resources.forEach((inputResource: InputResource) => {
      // convert tuple to object
      inputResource = convertToObject(inputResource);

      const { resourceType, resourceId, data, options } = inputResource;

      // validate
      validateBatchItem(model, inputResource);

      // default values
      inputResource.data = data ? convertRelatedIdsToSets(resourceType, data, model) : {};
      inputResource.options = options || {};

      const outputResource = inputResource as OutputResource;

      // add to outputs
      const compositeIdString = makeCompositeId(resourceType, resourceId);
      outputResources.set(compositeIdString, outputResource)
    });

    return {
      type: TYPE,
      resources: outputResources
    };
  };

  return { TYPE, creator };
};

const convertToObject = (inputResource: InputResource): InputResourceObject => {
  if (Array.isArray(inputResource)) {
    const [resourceType, resourceId, data, options] = inputResource;
    return { resourceType, resourceId, data, options };
  }

  return inputResource;
};

type FkData = Record<Fkey, Set<Id>>

export const convertRelatedIdsToSets = (resourceType: Type, data: Data, model: Model): Data => {
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
