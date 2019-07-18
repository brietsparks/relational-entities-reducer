import Model from '../model';
import {
  Id,
  LinkRemovalSchema,
  Operation,
  OpId,
  RelationKey,
  RelationName,
  RemoveOperation,
  Type
} from '../interfaces';
import { Repository, Visitor } from '../operation';
import { isObjectLiteral } from '../util';
import { OP_REMOVE } from '../operation/repository';

export default function transformRemoveOperations(
  model: Model, operations: Map<OpId, RemoveOperation>, repository?: Repository
) {
  repository = repository || new Repository(model, operations);
  const visitor = new Visitor(repository);

  operations.forEach(({ type, id, options }) => {
    const data = model.getResource(type, id);

    if (!data) {
      return;
    }

    if (isObjectLiteral(options.removeLinked)) {
      const linkedRemoveOperations = new Map<OpId, RemoveOperation>();

      model.extractAllLinks(type, data).forEach(({ linkedId, relatedType, relationKey, relationName }) => {
        repository = repository as Repository;

        const fromPayload = repository.getFromPayload(relatedType, linkedId);
        if (fromPayload && fromPayload.operator === OP_REMOVE) {
          return;
        }

        let relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

        if (relatedOperation) {
          const removalSchema = options.removeLinked as LinkRemovalSchema;

          const nestedRemovalSchema = extractNestedRemovalSchema(removalSchema, relationKey, relationName);

          linkedRemoveOperations.set(
            Repository.makeOpId(relatedType, linkedId),
            { ...relatedOperation, operator: OP_REMOVE, options: { removeLinked: nestedRemovalSchema } }
          );
        }
      });

      linkedRemoveOperations.forEach((linkedRemoveOperation, opId) => {
        repository = repository as Repository;
        repository.setInPayload(opId, linkedRemoveOperation);
      });

      transformRemoveOperations(model, linkedRemoveOperations, repository);
    }

    const links = model.extractAllLinks(type, data);

    links.forEach(({ relatedType, linkedId, relationKey }) => {
      const { reciprocalKey, reciprocalCardinality } = model.getEntity(type).getRelationDefinition(relationKey);

      repository = repository as Repository;
      const relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

      if (relatedOperation && relatedOperation.operator !== OP_REMOVE) {
        visitor.unlink(relatedOperation, reciprocalKey, reciprocalCardinality, id, true);
      }
    });
  });

  return repository.getPayload();
};

export const extractNestedRemovalSchema = (
  removalSchema: LinkRemovalSchema,
  relationKey: RelationKey,
  relationName: RelationName
): LinkRemovalSchema|undefined => {
  let nestedValue;

  nestedValue = removalSchema[relationKey] || removalSchema[relationName];

  if (!nestedValue) {
    return;
  }

  return typeof nestedValue === 'function' ? nestedValue() : nestedValue;
};
