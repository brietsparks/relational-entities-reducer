import { Data, Fkey, Id, Type } from '../../model/resource';
import { Model } from '../../model';

interface Resource {
  resourceType: Type;
  resourceId: Id;
  data: Data,
  options: { ignoreIdIndex?: boolean }
}

type InputResources = Map<Id, Resource>
type InputResourcesByType = { [type in Type]: InputResources }
export interface InputAction {
  type: string,
  resources: InputResourcesByType
}

type OutputResources = { [id in Id]: Resource };
type OutputResourcesByType = { [type in Type]: OutputResources };
type OutputIds = Id[]
type OutputIdsByType = { [type in Type]: OutputIds };
export interface OutputAction {
  type: string,
  resources: OutputResourcesByType,
  ids: OutputIdsByType
}

export default function convertToPrimitives(model: Model, action: InputAction): OutputAction {
  const outputResources: OutputResourcesByType = {};
  const outputIds: OutputIdsByType = {};

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
