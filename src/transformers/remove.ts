import Model from '../model';
import { OpId, RemoveOperation } from '../interfaces';
import { Repository, Visitor } from '../operation';

export default function transformRemoveOperations(model: Model, operations: Map<OpId, RemoveOperation>) {
  const repository = new Repository(model, operations);
  const visitor = new Visitor(repository);

  operations.forEach(({ type, id, options }) => {
    const data = model.getResource(type, id);

    if (!data) {
      return;
    }

    const links = model.extractAllLinks(type, data);

    links.forEach(({ relatedType, linkedId, relationKey }) => {
      const { reciprocalKey, reciprocalCardinality } = model.getEntity(type).getRelationDefinition(relationKey);

      const relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

      if (relatedOperation) {
        visitor.unlink(relatedOperation, reciprocalKey, reciprocalCardinality, id, true);
      }
    });
  });

  return repository.getPayload();
};

export const recursivelyRemove = () => {

};
