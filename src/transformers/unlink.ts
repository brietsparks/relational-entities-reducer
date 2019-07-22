import Model from '../model';
import { CidString, UnlinkDefinition } from '../interfaces';
import { Repository, LinkManager } from '../operation';

export default function transformUnlinkDefinitions(model: Model, definitions: Map<CidString, UnlinkDefinition>) {
  const repository = new Repository(model);
  const linkManager = new LinkManager(repository);

  definitions.forEach(({ id, type, relation, linkedId }) => {
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
      linkManager.unlink(
        operation, relationKey, cardinality,
        relatedOperation, reciprocalKey, reciprocalCardinality
      );
    }
  });

  return repository.getPayload();
};
