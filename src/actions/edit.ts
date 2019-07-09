import { Namespace } from '../options';
import { Model } from '../model';
import {
  ActionResource,
  Data,
  Id,
  ResourceCollectionObjectByCid,
  ResourcePointerObject,
  Type
} from '../interfaces';
import { Action as GenericAction } from './index';
import { validateResourceData, validateResourceId, validateResourceType } from './validation';
import { makeCompositeId } from '../util';

export interface Action extends GenericAction {
  resources: OutputResources,
}
export interface Creator {
  (...p: InputResources): Action
}

// inputs
interface InputResourceObject extends ResourcePointerObject {
  data: Data;
}
type InputResourceTuple = [Type, Id, Data];
type InputResource = InputResourceObject | InputResourceTuple;
type InputResources = InputResource[];

// outputs
interface OutputResource extends ActionResource {}

type OutputResources = ResourceCollectionObjectByCid<OutputResource>

export const makeEdit = (namespace: Namespace, model: Model) => {
  const TYPE = namespace('EDIT');

  const creator: Creator = (...resources: InputResources): Action => {
    const outputResources: OutputResources = {};

    resources.forEach(inputResource => {
      // convert tuple to object
      if (Array.isArray(inputResource)) {
        const [ resourceType, resourceId, data ] = inputResource;
        inputResource = { resourceType, resourceId, data };
      }

      const resource = inputResource as OutputResource;

      const { resourceType, resourceId, data } = resource;

      // validate
      validateResourceType(resourceType, model);
      validateResourceId(resourceId);
      validateResourceData(data);

      // defaults
      resource.data = data || {};
      resource.options = {};

      // add to outputs
      const compositeIdString = makeCompositeId(resourceType, resourceId);
      outputResources[compositeIdString] = resource;
    });

    return {
      type: TYPE,
      resources: outputResources
    }
  };

  return { TYPE, creator }
};
