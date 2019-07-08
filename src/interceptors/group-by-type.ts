import {
  ResourceCollectionMapByCid,
  ResourceCollectionMapById,
  ResourceCollectionObjectByCid,
  ResourceCollectionObjectById,
  ResourcePointerObject,
  ResourceCollectionsByType
} from '../interfaces';

export interface InputAction<Resources> extends Action<Resources> {}
export interface OutputAction<Resources> extends Action<Resources> {}

interface Action<Resources> {
  type: string;
  resources: Resources;
}

type InputResourcesMap = ResourceCollectionMapByCid<ResourcePointerObject>;
type OutputResourcesMap = ResourceCollectionsByType<ResourceCollectionMapById<ResourcePointerObject>>;
export const groupMapsByType = (inputAction: Action<InputResourcesMap>): Action<OutputResourcesMap> => {
  const outputResources: OutputResourcesMap = {};

  inputAction.resources.forEach(resource => {
    const { resourceId, resourceType } = resource;

    if (!outputResources[resourceType]) {
      outputResources[resourceType] = new Map();
    }

    outputResources[resourceType].set(resourceId, resource);
  });

  return {
    ...inputAction,
    resources: outputResources
  };
};

export type InputResourcesObject = ResourceCollectionObjectByCid<ResourcePointerObject>;
export type OutputResourcesObject = ResourceCollectionsByType<ResourceCollectionObjectById<ResourcePointerObject>>;
export const groupObjectsByType = (inputAction: Action<InputResourcesObject>): Action<OutputResourcesObject> => {
  const outputResources: OutputResourcesObject = {};

  Object.entries(inputAction.resources).forEach(([compositeIdString, resource]) => {
    const { resourceId, resourceType } = resource;

    if (!outputResources[resourceType]) {
      outputResources[resourceType] = {};
    }

    outputResources[resourceType][resourceId] = resource;
  });

  return {
    ...inputAction,
    resources: outputResources
  };
};
