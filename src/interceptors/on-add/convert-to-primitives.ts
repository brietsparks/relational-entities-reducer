import {
  Data,
  Fkey,
  Id,
  Type,
  ActionResource,
  ResourceCollectionMapById,
  ResourceCollectionObjectById,
  ResourceCollectionsByType,
  IdsByType
} from '../../interfaces';
import { Model } from '../../model';

export interface InputAction {
  type: string,
  resources: InputResourcesByType
}

export interface OutputAction {
  type: string,
  resources: OutputResourcesByType,
  ids: IdsByType
}

type Options = { ignoreIdIndex?: boolean };
type Resource = ActionResource<Options>;
type InputResources = ResourceCollectionMapById<Resource>;
type InputResourcesByType = ResourceCollectionsByType<InputResources>
type OutputResources = ResourceCollectionObjectById<Resource>;
type OutputResourcesByType = ResourceCollectionsByType<OutputResources>;

export default function convertToPrimitives(model: Model, action: InputAction): OutputAction {
  const outputResources: OutputResourcesByType = {};
  const outputIds: IdsByType = {};

  Object.entries(action.resources).forEach(([resourceType, resources]) => {
    outputResources[resourceType] = {};
    outputIds[resourceType] = [];

    resources.forEach((resource, resourceId) => {
      resource.data = convertRelatedIdsToArray(resourceType, resource.data, model);

      outputResources[resourceType][resourceId] = resource;

      if (!resource.options.ignoreIdIndex) {
        outputIds[resourceType].push(resourceId)
      }
    })
  });

  return {
    ...action,
    resources: outputResources,
    ids: outputIds
  }
}

type FkData = Record<Fkey, Id[]>

export const convertRelatedIdsToArray = (resourceType: Type, data: Data, model: Model): Data => {
  const fks = model.getEntity(resourceType).getFksMany();

  const fkData: FkData = {};

  fks.forEach(fk => {
    const relatedIds: Set<Id> = data[fk];

    if (relatedIds) {
      fkData[fk] = Array.from(relatedIds);
    }
  });

  return { ...data, ...fkData };
};
