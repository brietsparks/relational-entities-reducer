import Model from '../model';
import {
  AddOperation,
  IndicesByRelation,
  IndicesByRelationKey,
  Operation,
  OpId,
  RelationKey,
  Type
} from '../interfaces';
import { Repository, LinkManager } from '../operation';
import { isObjectLiteral } from '../util';

export default function transformAddOperations(
  model: Model,
  operations: Map<OpId, AddOperation>
): Map<OpId, Operation> {
  const repository = new Repository(model, operations);
  const linkManager = new LinkManager(repository);

  operations.forEach(({ type, id, data, options }) => {
    if (model.hasResource(type, id)) {
      repository.removeFromPayload([type,id]);
      return;
    }

    const entity = model.getEntity(type);

    model.extractAllLinks(type, data).forEach(({ relationKey, linkedId, index }) => {
      const {
        reciprocalKey, relatedType,
        cardinality, reciprocalCardinality
      } = entity.getRelationDefinition(relationKey);

      // retrieve the operations
      let operation = repository.getFromPayload(type, id);
      let relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId, true);

      // link them together
      if (operation && relatedOperation) {
        const indicesByRelationKey = toIndicesByRelationKey(model, type, options.indicesByRelation);
        const indexInLinked = indicesByRelationKey[relationKey];

        linkManager.link(
          operation, relationKey, cardinality, index,
          relatedOperation, reciprocalKey, reciprocalCardinality, indexInLinked
        );
      }
    });
  });

  return repository.getPayload();
};

export const toIndicesByRelationKey = (model: Model, type: Type, byRelation: IndicesByRelation = {}): IndicesByRelationKey => {
  return Object.entries(byRelation).reduce((indicesByRelationKey, [relation, index]) => {
    if (model.getEntity(type).hasRelation(relation)) {
      const relationKey = model.getRelationKey(type, relation);
      indicesByRelationKey[relationKey] = index;
    }

    return indicesByRelationKey;
  }, {} as IndicesByRelationKey);
};

// const getIndexByRelation = (relation: RelationKey, indicesByRelation?: IndicesByRelation): number|undefined => {
//   if (indicesByRelation && isObjectLiteral(indicesByRelation)) {
//     return indicesByRelation[relation]
//   }
// };
