import { OpId, EditOperation } from '../interfaces';
import Model from '../model';
import { ReindexRelatedAction } from '../actions';
import { arrayMove, makeCidString } from '../util';
import { OP_EDIT } from '../constants';

export default function transformReindexRelated(
  model: Model,
  action: ReindexRelatedAction,
): Map<OpId, EditOperation> {
  const operations = new Map<OpId, EditOperation>();

  const { resourceType, resourceId, relation, destination, source } = action;

  const data = model.getResource(resourceType, resourceId);

  if (!data) {
    return operations;
  }

  const hasRelation = model.getEntity(resourceType).hasRelation(relation);

  if (!hasRelation) {
    return operations;
  }

  const relationKey = model.getRelationKey(resourceType, relation);

  let linkedData = data[relationKey];

  if (!Array.isArray(linkedData) || linkedData[source] === undefined) {
    return operations;
  }

  linkedData = [...linkedData];

  arrayMove(linkedData, source, destination);

  operations.set(
    makeCidString(resourceType, resourceId),
    {
      type: resourceType,
      id: resourceId,
      data: { [relationKey]: linkedData },
      options: {},
      operator: OP_EDIT,
    }
  );

  return operations;
}


