import Model from '../model';
import { AddOperation, IndicesByRelation, OpId, RelationKey } from '../interfaces';
import { Repository, LinkManager } from '../operation';
import { isObjectLiteral } from '../util';

export default function transformAddOperations(model: Model, operations: Map<OpId, AddOperation>) {
  const repository = new Repository(model, operations);
  const linkManager = new LinkManager(repository);

  operations.forEach(({ type, id, data, options }) => {
    if (model.hasResource(type, id)) {
      return;
    }

    const entity = model.getEntity(type);

    const links = model.extractAllLinks(type, data);
    links.forEach(({ relationKey, linkedId, index }) => {
      const { reciprocalKey, relatedType, cardinality, reciprocalCardinality } = entity.getRelationDefinition(relationKey);

      // retrieve the operations
      let operation = repository.getFromPayload(type, id);
      let relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId, true);

      // link them together
      if (operation && relatedOperation) {
        const indexInLinked = getIndexByRelation(relationKey, options.indicesByRelation);
        linkManager.link(
          operation, relationKey, cardinality, index,
          relatedOperation, reciprocalKey, reciprocalCardinality, indexInLinked
        );
      }
    });
  });

  return repository.getPayload();
};

const getIndexByRelation = (relation: RelationKey, indicesByRelation?: IndicesByRelation): number|undefined => {
  if (indicesByRelation && isObjectLiteral(indicesByRelation)) {
    return indicesByRelation[relation]
  }
};
