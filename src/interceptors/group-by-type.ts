import { CompositeIdString, Id, Type } from '../model/resource';

export interface Resource {
  resourceType: Type,
  resourceId: Id
}

export type InputResources = Map<CompositeIdString, Resource>

export interface InputAction {
  type: string,
  resources: InputResources,
}

export type OutputResources = {
  [type in Type]: Map<Id, Resource>
}
export type OutputAction = {
  type: string,
  resources: OutputResources,
}

export default (inputAction: InputAction): OutputAction => {
  const outputResources: OutputResources = {};

  inputAction.resources.forEach(resources => {
    const { resourceId, resourceType } = resources;

    if (!outputResources[resourceType]) {
      outputResources[resourceType] = new Map();
    }

    outputResources[resourceType].set(resourceId, resources);
  });

  return {
    ...inputAction,
    resources: outputResources
  };
}
