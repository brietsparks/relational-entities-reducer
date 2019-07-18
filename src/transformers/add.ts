import Model from '../model';
import { AddOperation, IndicesByRelation, OpId, RelationKey } from '../interfaces';
import { Repository, Visitor } from '../operation';
import { isObjectLiteral } from '../util';

export default function transformAddOperations(model: Model, operations: Map<OpId, AddOperation>) {
  const repository = new Repository(model, operations);
  const visitor = new Visitor(repository);

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
        visitor.link(operation, relatedOperation, relationKey, cardinality, reciprocalKey, index);
        visitor.link(relatedOperation, operation, reciprocalKey, reciprocalCardinality, relationKey, indexInLinked);
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
