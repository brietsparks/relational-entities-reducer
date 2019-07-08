import { Model } from '../model';
import {
  State,
  ResourceCollectionMapByCid,
  ResourceCollectionObjectByCid,
  ResourcePointerObject
} from '../interfaces';
import * as selectors from '../selectors';

interface InputAction<Resources> extends Action<Resources> {}
interface OutputAction<Resources> extends Action<Resources> {}

interface Action<Resources> {
  type: string,
  resources: Resources
}

type ResourcesMap = ResourceCollectionMapByCid<ResourcePointerObject>;
export const filterMap = (
  model: Model, state: State, inputAction: Action<ResourcesMap>, includeIfExists: boolean
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

type ResourcesObject = ResourceCollectionObjectByCid<ResourcePointerObject>
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
