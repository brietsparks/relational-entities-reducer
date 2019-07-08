import { CompositeIdString, Id, Type } from '../model/resource';

export interface Resource {
  resourceType: Type,
  resourceId: Id
}

export interface InputAction<Resources> {
  type: string;
  resources: Resources;
}

export type OutputAction<Resources> = {
  type: string;
  resources: Resources;
}

export type InputResourcesMap = Map<CompositeIdString, Resource>;
export type OutputResourcesMap = { [type in Type]: Map<Id, Resource> };
export const groupMapsByType = (inputAction: InputAction<InputResourcesMap>): OutputAction<OutputResourcesMap> => {
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

export type InputResourcesObject = { [s in CompositeIdString]: Resource };
export type OutputResourcesObject = { [type in Type]: { [id in Id]: Resource } };
export const groupObjectsByType = (inputAction: InputAction<InputResourcesObject>): OutputAction<OutputResourcesObject> => {
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
