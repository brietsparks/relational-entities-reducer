import Model from '../model';
import { LinkRemovalSchema, OpId, RelationKey, RelationName, RemoveOperation, Type } from '../interfaces';
import { Repository, LinkManager } from '../operation';
import { isObjectLiteral } from '../util';
import { OP_REMOVE } from '../constants';

export default function transformRemoveOperations(
  model: Model,
  operations: Map<OpId, RemoveOperation>,
  repository?: Repository
) {
  repository = repository || new Repository(model, operations);
  const linkManager = new LinkManager(repository);

  operations.forEach(({ type, id, options }) => {
    repository = repository as Repository;
    const data = model.getResource(type, id);

    if (!data) {
      repository.removeFromPayload([type, id]);
      return;
    }

    if (isObjectLiteral(options.removalSchema)) {
      const linkedRemoveOperations = new Map<OpId, RemoveOperation>();

      const removalSchema = byRelationKey(type, model, options.removalSchema);

      model.extractAllLinks(type, data).forEach(({ linkedId, relatedType, relationKey, relationName }) => {
        repository = repository as Repository;

        if (!removalSchema.hasOwnProperty(relationKey)) {
          return;
        }

        // if removal already in payload then skip
        const fromPayload = repository.getFromPayload(relatedType, linkedId);
        if (fromPayload && fromPayload.operator === OP_REMOVE) {
          return;
        }

        // make the linked removal operations
        let relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);
        if (relatedOperation) {
          const nestedRemovalSchema = extractNestedRemovalSchema(removalSchema, relationKey);

          linkedRemoveOperations.set(
            Repository.makeOpId(relatedType, linkedId),
            { ...relatedOperation, operator: OP_REMOVE, options: { removalSchema: nestedRemovalSchema } }
          );
        }
      });

      // add each linked operation to the payload
      linkedRemoveOperations.forEach((linkedRemoveOperation, opId) => {
        repository = repository as Repository;
        repository.setInPayload(opId, linkedRemoveOperation);
      });

      // recurse
      transformRemoveOperations(model, linkedRemoveOperations, repository);
    }

    // detach from linked resources
    model.extractAllLinks(type, data).forEach(({ relatedType, linkedId, relationKey }) => {
      repository = repository as Repository;
      const operation = repository.getFromPayloadOrState(type, id);
      const { cardinality, reciprocalKey, reciprocalCardinality } = model.getEntity(type).getRelationDefinition(relationKey);

      repository = repository as Repository;
      const relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

      if (operation && relatedOperation && relatedOperation.operator !== OP_REMOVE) {
        linkManager.unlink(
          operation, relationKey, cardinality,
          relatedOperation, reciprocalKey, reciprocalCardinality
        );
      }
    });
  });

  return repository.getPayload();
};

export const byRelationKey = (type: Type, model: Model, removalSchema: LinkRemovalSchema = {}): LinkRemovalSchema => {
  return Object.entries(removalSchema).reduce((schemaByRelationKey, [relation, schema]) => {
    if (model.getEntity(type).hasRelation(relation)) {
      const relationKey = model.getRelationKey(type, relation);
      schemaByRelationKey[relationKey] = schema;
    }

    return schemaByRelationKey;
  }, {} as LinkRemovalSchema);
};

export const extractNestedRemovalSchema = (
  removalSchema: LinkRemovalSchema,
  relationKey: RelationKey,
): LinkRemovalSchema|undefined => {
  const nestedValue = removalSchema[relationKey];

  if (!nestedValue) {
    return;
  }

  return typeof nestedValue === 'function' ? nestedValue() : nestedValue;
};
