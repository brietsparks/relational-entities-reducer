import { Model } from '../model';
import { State } from '../model/resource';
import { Id, Type, CompositeIdString } from '../model/resource';
import * as selectors from '../selectors';

interface Action {
  type: string,
  resources: Resources
}

interface Resource {
  resourceType: Type,
  resourceId: Id
}

export type Resources = Map<CompositeIdString, Resource>;

export default function filterByExistence(
  model: Model,
  state: State,
  inputAction: Action,
  includeIfExists: boolean
): Action {
  const outputResources: Resources = new Map();

  inputAction.resources.forEach((resource, compositeId) => {
    const existsInState = selectors.getDoesResourceExist(
      state, [resource.resourceType, resource.resourceId ]
    );

    const shouldInclude = (existsInState && includeIfExists) || (!existsInState && !includeIfExists);

    if (shouldInclude) {
      outputResources.set(compositeId, resource);
    }

    return outputResources;
  });

  return {
    ...inputAction,
    resources: outputResources
  }
};
