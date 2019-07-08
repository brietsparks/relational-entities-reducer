import { Model } from '../model';
import { State, ResourceCollectionMapByCid, ResourceCollectionObjectByCid, ResourcePointerObject } from '../interfaces';
import * as selectors from '../selectors';

type ResourcesMap = ResourceCollectionMapByCid<ResourcePointerObject>;
export const filterMap = (
  model: Model, state: State, resources: ResourcesMap, includeIfExists: boolean
): ResourcesMap => {
  const outputResources: ResourcesMap = new Map();

  resources.forEach((resource, compositeIdString) => {
    const existsInState = selectors.getDoesResourceExist(
      state, [resource.resourceType, resource.resourceId ]
    );

    const shouldInclude = (existsInState && includeIfExists) || (!existsInState && !includeIfExists);

    if (shouldInclude) {
      outputResources.set(compositeIdString, resource);
    }

    return outputResources;
  });

  return outputResources;
};

type ResourcesObject = ResourceCollectionObjectByCid<ResourcePointerObject>
export const filterObject = (
  model: Model,
  state: State,
  resources: ResourcesObject,
  includeIfExists: boolean
): ResourcesObject => {
  const outputResources: ResourcesObject = {};

  Object.entries(resources).forEach(([compositeIdString, resource]) => {
    const existsInState = selectors.getDoesResourceExist(
      state, [resource.resourceType, resource.resourceId ]
    );

    const shouldInclude = (existsInState && includeIfExists) || (!existsInState && !includeIfExists);

    if (shouldInclude) {
      outputResources[compositeIdString] = resource;
    }

    return outputResources;
  });

  return outputResources;
};
