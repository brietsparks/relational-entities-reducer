import Model from '../model';
import { CidString, LinkDefinition } from '../interfaces';
import { Repository, Visitor } from '../operation';

export default function transformLinkDefinitions(model: Model, definitions: Map<CidString, LinkDefinition>) {
  const repository = new Repository(model);
  const visitor = new Visitor(repository);

  definitions.forEach(({ type, id, relation, linkedId, indices }) => {
    const relationKey = model.getRelationKey(type, relation);

    const {
      reciprocalKey,
      reciprocalCardinality,
      cardinality,
      relatedType,
    } = model.getEntity(type).getRelationDefinition(relationKey);

    const operation = repository.getFromPayloadOrState(type, id);
    const relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

    if (operation && relatedOperation) {
      visitor.link(operation, relatedOperation, relationKey, cardinality, reciprocalKey, indices[0]);
      visitor.link(relatedOperation, operation, reciprocalKey, reciprocalCardinality, relationKey, indices[1]);
    }
  });

  return repository.getPayload();
};
