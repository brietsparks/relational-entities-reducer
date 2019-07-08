import {
  ResourceCollectionMapByCid,
  ResourceCollectionMapById,
  ResourceCollectionObjectByCid,
  ResourceCollectionObjectById,
  ResourcePointerObject,
  ResourceCollectionsByType
} from '../interfaces';

type InputResourcesMap = ResourceCollectionMapByCid<ResourcePointerObject>;
type OutputResourcesMap = ResourceCollectionsByType<ResourceCollectionMapById<ResourcePointerObject>>;
export const groupMapsByType = (resources: InputResourcesMap): OutputResourcesMap => {
  const outputResources: OutputResourcesMap = {};

  resources.forEach(resource => {
    const { resourceId, resourceType } = resource;

    if (!outputResources[resourceType]) {
      outputResources[resourceType] = new Map();
    }

    outputResources[resourceType].set(resourceId, resource);
  });

  return outputResources;
};

export type InputResourcesObject = ResourceCollectionObjectByCid<ResourcePointerObject>;
export type OutputResourcesObject = ResourceCollectionsByType<ResourceCollectionObjectById<ResourcePointerObject>>;
export const groupObjectsByType = (resources: InputResourcesObject): OutputResourcesObject => {
  const outputResources: OutputResourcesObject = {};

  Object.entries(resources).forEach(([compositeIdString, resource]) => {
    const { resourceId, resourceType } = resource;

    if (!outputResources[resourceType]) {
      outputResources[resourceType] = {};
    }

    outputResources[resourceType][resourceId] = resource;
  });

  return outputResources;
};
