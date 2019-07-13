import {
  Id,
  Data,
  MANY,
  RelatedPointer,
  ResourceCollectionObjectByCid,
  ResourcePointerObject,
  State
} from '../../interfaces';

import { Model } from '../../model';

import * as selectors from '../../selectors';
import { makeCompositeId } from '../../util';

interface UnrelatableResource extends ResourcePointerObject {
  data: Data
}

export type EditableResources = ResourceCollectionObjectByCid<UnrelatableResource>
export type Resources = ResourceCollectionObjectByCid<ResourcePointerObject>
export default function unrelate(model: Model, state: State, removableResources: Resources) {
  const editableResources: EditableResources = {};

  Object.entries(removableResources).forEach(([compositeId, resourceToRemove]) => {
    const { resourceType, resourceId } = resourceToRemove;

    const resourceInState = selectors.getResource(state, [resourceType, resourceId]);

    const relatedPointers: RelatedPointer[] = model.getEntity(resourceType).extractRelatedPointers(resourceInState);

    relatedPointers.forEach(({
      relatedType,
      relatedId,
      reciprocalFk,
      reciprocalCardinality
    }) => {
      const relatedCompositeId = makeCompositeId(relatedType, relatedId);

      if (removableResources[relatedCompositeId]) {
        return;
      }

      const relatedResourceInState = selectors.getResource(state, [relatedType, relatedId]);

      const reciprocalRelationData = reciprocalCardinality === MANY
        ? relatedResourceInState[reciprocalFk].filter((reciprocalId: Id) => reciprocalId !== resourceId)
        : null;

      editableResources[relatedCompositeId] = {
        resourceType: relatedType,
        resourceId: relatedId,
        data: { ...relatedResourceInState, [reciprocalFk]: reciprocalRelationData }
      };
    });
  });

  return editableResources
}
