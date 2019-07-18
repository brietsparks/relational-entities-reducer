import Model from '../model';
import { CidString, UnlinkDefinition } from '../interfaces';
import { Repository, Visitor } from '../operation';

export default function transformUnlinkDefinitions(model: Model, definitions: Map<CidString, UnlinkDefinition>) {
  const repository = new Repository(model);
  const visitor = new Visitor(repository);

  definitions.forEach(({ id, type, relation, linked, byId }) => {
    const relationKey = model.getRelationKey(type, relation);

    const {
      reciprocalKey,
      reciprocalCardinality,
      cardinality,
      relatedType,
    } = model.getEntity(type).getRelationDefinition(relationKey);

    const operation = repository.getFromPayloadOrState(type, id);
    if (!operation) {
      return;
    }

    const unlinkedId = visitor.unlink(operation, relationKey, cardinality, linked, byId);
    if (!unlinkedId) {
      return;
    }

    const relatedOperation = repository.getFromPayloadOrState(relatedType, unlinkedId);
    if (!relatedOperation) {
      return;
    }

    visitor.unlink(relatedOperation, reciprocalKey, reciprocalCardinality, id, true);
  });

  return repository.getPayload();
};
