import {
  Id,
  Type,
  RelationRemovalSchema,
  State,
  ResourcePointerObject,
  ResourceCollectionObjectByCid
} from '../../interfaces';
import { Model } from '../../model';
import { makeCompositeId } from '../../util';
import * as selectors from '../../selectors';

export interface InputAction extends Action {}
export interface OutputAction extends Action {}

interface Action {
  type: string,
  resources: Resources
}

interface Options {
  removeRelated?: RelationRemovalSchema
}

interface Resource extends ResourcePointerObject {
  options: Options
}
type Resources = ResourceCollectionObjectByCid<Resource>
export default function unrelate(model: Model, state: State, action: Action): Action {
  let relatedResources: Resources = {};

  const resources = action.resources;
  Object.entries(resources).forEach(([compositeIdString, resource]) => {
    if (resource.options.removeRelated) {
      const relatedResourcesToRemove = getRelatedResourcesToRemove(
        resource.resourceType,
        resource.resourceId,
        resource.options.removeRelated,
        model,
        state
      );

      relatedResources = {...relatedResources, ...relatedResourcesToRemove}
    }
  });

  const outputResources = {
    ...resources,
    ...relatedResources
  };

  return {
    ...action,
    resources: outputResources
  }
};

export const getRelatedResourcesToRemove = (
  resourceType: Type,
  resourceId: Id,
  removalSchema: RelationRemovalSchema,
  model: Model,
  state: State,
): Resources => {
  const resourcesToRemove: Resources = {};

  Object.entries(removalSchema).forEach(([fk, nestedRemovalSchema]) => {
    const entity = model.getEntity(resourceType);

    // if fk in the removal schema isn't valid, then skip
    const hasFk = entity.hasFk(fk);
    if (!hasFk) {
      return;
    }

    // get the related ids
    const resource = selectors.getResource(state, [resourceType, resourceId]);
    let relatedData = resource[fk];

    // if there's related ids, then skip
    if (!relatedData) {
      return;
    }

    const relatedType = entity.getTypeByFk(fk);

    if (entity.isOneFk(fk)) {
      relatedData = [relatedData];
    }

    relatedData.forEach((relatedId: Id) => {
      const relatedCompositeIdString = makeCompositeId(relatedType, relatedId);

      resourcesToRemove[relatedCompositeIdString] = {
        resourceType: relatedType,
        resourceId: relatedId,
        options: {}
      };

      nestedRemovalSchema = typeof nestedRemovalSchema === 'function' ? nestedRemovalSchema() : nestedRemovalSchema;

      const nestedResourcesToRemove = getRelatedResourcesToRemove(
        relatedType,
        relatedId,
        nestedRemovalSchema,
        model,
        state,
      );

      Object
        .entries(nestedResourcesToRemove)
        .forEach(([cid, nestedResource]) => resourcesToRemove[cid] = nestedResource);
    });
  });

  return resourcesToRemove;
};
