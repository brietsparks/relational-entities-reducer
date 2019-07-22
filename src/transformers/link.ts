import Model from '../model';
import { CidString, LinkDefinition } from '../interfaces';
import { Repository, LinkManager } from '../operation';

export default function transformLinkDefinitions(model: Model, definitions: Map<CidString, LinkDefinition>) {
  const repository = new Repository(model);
  const linkManager = new LinkManager(repository);

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
      linkManager.link(
        operation, relationKey, cardinality, indices[0],
        relatedOperation, reciprocalKey, reciprocalCardinality, indices[1]
      );
    }
  });

  return repository.getPayload();
};
