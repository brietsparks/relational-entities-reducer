import { Namespace } from '../options';
import { Model } from '../model';
import { validateResourceOptions, validateResourceId, validateResourceType } from './validation';
import { Id, Type, CompositeId, RelationRemovalSchema } from '../interfaces';
import { makeCompositeId } from '../util';

export interface Action {
  type: string,
  remove: OutputResources
}

export interface Creator {
  (...p: InputResources): Action
}

interface Resource {
  resourceType: Type;
  resourceId: Id;
  options?: Options
}

interface Options {
  removeRelated?: RelationRemovalSchema
}

type InputObject = Resource;
type InputTuple = [Type, Id, Options?];
type InputResource = InputObject | InputTuple;
type InputResources = InputResource[];
type OutputResources = { [s in CompositeId]: Resource }

export const makeRemove = (namespace: Namespace, model: Model) => {
  const TYPE = namespace('REMOVE');

  const creator: Creator = (...resources: InputResources): Action => {
    const outputResources = resources.reduce((outputResources, resource) => {
      // convert tuple to object
      if (Array.isArray(resource)) {
        const [ resourceType, resourceId, options ] = resource;
        resource = { resourceType, resourceId, options };
      }

      const { resourceType, resourceId, options } = resource;

      // validate
      validateResourceType(resourceType, model);
      validateResourceId(resourceId);
      validateResourceOptions(options);

      // default values
      resource.options = options || {};

      // add to outputs
      const compositeIdString = makeCompositeId(resourceType, resourceId);
      outputResources[compositeIdString] = resource;

      return outputResources;
    }, {} as OutputResources);

    return {
      type: TYPE,
      remove: outputResources
    }
  };

  return {
    TYPE,
    creator
  }
};
