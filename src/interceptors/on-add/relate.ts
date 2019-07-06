import {
  makeCompositeIdString,
  State,
  Id,
  Type,
  CompositeIdString,
  MANY,
  ONE,
  Data,
  RelatedPointer,
} from '../../model/resource';
import { Model } from '../../model';
import * as selectors from '../../selectors';

export interface Action {
  type: string,
  resources: Resources
}

interface Resource {
  resourceType: Type,
  resourceId: Id,
  data: Data,
  options: { ignoreIdIndex?: boolean }
}

type Resources = Map<CompositeIdString, Resource>;

export default function relate(model: Model, state: State, action: Action): Action {
  const resources = action.resources;
  const relatedResources: Resources = new Map();

  resources.forEach(resource => {
    const { resourceType, resourceId, data } = resource;

    const relatedPointers: RelatedPointer[] = model.getEntity(resourceType).extractRelatedPointers(data);

    relatedPointers.forEach(({
      relatedType,
      relatedId,
      reciprocalFk,
      reciprocalCardinality
    }) => {
      // the key for getting/setting the addable in the batch
      const relatedCompositeIdString = makeCompositeIdString(relatedType, relatedId);

      // if it already exists in state, then make a resource of it, make the relation, and add it to the batch
      const existingResource = selectors.getResource(state, [relatedType, relatedId]);

      if (existingResource) {
        const existingFkData = existingResource[reciprocalFk] || [];

        const fkData = reciprocalCardinality === MANY ? new Set([...existingFkData, resourceId]) : resourceId;

        relatedResources.set(relatedCompositeIdString, {
          resourceType: relatedType,
          resourceId: relatedId,
          data: { ...existingResource, [reciprocalFk]: fkData },
          options: { ignoreIdIndex: true } // since this resource already exists, ignore it when setting ordered ids state
        });

        return;
      }

      // the id of the resource that will be added to the related resource
      const fkData: (Set<Id> | Id) = reciprocalCardinality === MANY ? new Set([resourceId]) : resourceId;

      /*
      three possibilities:
      1) the related addable exists already in the batch because it was provided in the action args
      2) the related addable exists already in the relatedBatch because it was added in a previous iteration of this loop
      3) the related addable does not exist in the batch or related batch because neither of the previous 2 scenarios have occurred
      */

      // look for the related addable in the batches
      let relatedResource: Resource|undefined = resources.get(relatedCompositeIdString) || relatedResources.get(relatedCompositeIdString);

      // if the related resource is not found in either batch, then create it (scenario 3)
      if (!relatedResource) {
        relatedResource = {
          resourceType: relatedType,
          resourceId: relatedId,
          data: { [reciprocalFk]: fkData },
          options: {}
        };

        relatedResources.set(relatedCompositeIdString, relatedResource);

        return;
      }
      // if found in the batches, then make it related to to the addable resource (scenario 1 or 2)
      else {
        if (reciprocalCardinality === MANY) {
          const currentFkData = relatedResource.data[reciprocalFk] || [];
          relatedResource.data[reciprocalFk] = new Set([
            ...Array.from(currentFkData),
            ...Array.from(fkData as Set<Id>)
          ]);
          return;
        }

        if (reciprocalCardinality === ONE) {
          relatedResource.data[reciprocalFk] = fkData;
          return;
        }
      }
    });
  });

  const outputResources: Resources = new Map([
    ...Array.from(resources),
    ...Array.from(relatedResources)
  ]);

  return {
    ...action,
    resources: outputResources
  };
}
