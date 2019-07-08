import { Model } from '../model';
import { State } from '../model/resource';
import { Id, Type, CompositeIdString } from '../model/resource';
import * as selectors from '../selectors';

interface Action<Resources> {
  type: string,
  resources: Resources
}

interface Resource {
  resourceType: Type,
  resourceId: Id
}

type ResourcesMap = Map<CompositeIdString, Resource>;
export const filterMap = (
  model: Model,
  state: State,
  inputAction: Action<ResourcesMap>,
  includeIfExists: boolean
): Action<ResourcesMap> => {
  const outputResources: ResourcesMap = new Map();

  inputAction.resources.forEach((resource, compositeIdString) => {
    const existsInState = selectors.getDoesResourceExist(
      state, [resource.resourceType, resource.resourceId ]
    );

    const shouldInclude = (existsInState && includeIfExists) || (!existsInState && !includeIfExists);

    if (shouldInclude) {
      outputResources.set(compositeIdString, resource);
    }

    return outputResources;
  });

  return {
    ...inputAction,
    resources: outputResources
  }
};

type ResourcesObject = { [s in CompositeIdString]: Resource }
export const filterObject = (
  model: Model,
  state: State,
  inputAction: Action<ResourcesObject>,
  includeIfExists: boolean
): Action<ResourcesObject> => {
  const outputResources: ResourcesObject = {};

  Object.entries(inputAction.resources).forEach(([compositeIdString, resource]) => {
    const existsInState = selectors.getDoesResourceExist(
      state, [resource.resourceType, resource.resourceId ]
    );

    const shouldInclude = (existsInState && includeIfExists) || (!existsInState && !includeIfExists);

    if (shouldInclude) {
      outputResources[compositeIdString] = resource;
    }

    return outputResources;
  });

  return {
    ...inputAction,
    resources: outputResources
  }
};
