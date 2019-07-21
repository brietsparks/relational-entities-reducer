import { Cardinality, Id, Index, Operation, RelationKey } from '../interfaces';
import { MANY, ONE } from '../constants';
import Repository from './repository';
import * as immutability from './immutability';

export default class Visitor {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  link(
    operation: Operation, relationKey: RelationKey,
    cardinality: Cardinality, index: Index|undefined,

    relatedOperation: Operation, reciprocalKey: RelationKey,
    reciprocalCardinality: Cardinality, relatedIndex: Index|undefined
  ) {
    // detach any existing one-relation links
    if (cardinality === ONE) {
      const relinquentId = operation.data[relationKey];
      const relinquentOperation = this.repository.getFromPayloadOrState(relatedOperation.type, relinquentId);
      if (relinquentOperation) {
        this.unlink(
          operation, relationKey, cardinality,
          relinquentOperation, reciprocalKey, reciprocalCardinality
        );
      }
    }

    if (reciprocalCardinality === ONE) {
      const relinquentId = relatedOperation.data[reciprocalKey];
      const relinquentOperation = this.repository.getFromPayloadOrState(operation.type, relinquentId);
      if (relinquentOperation) {
        this.unlink(
          relatedOperation, reciprocalKey, reciprocalCardinality,
          relinquentOperation, relationKey, cardinality
        );
      }
    }

    // attach
    if (cardinality === ONE) {
      const data = immutability.setOneRelationId(operation.data, relationKey, relatedOperation.id);
      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });
    }

    if (cardinality === MANY) {
      const data = immutability.setManyRelationId(operation.data, relationKey, relatedOperation.id, index);
      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });
    }

    if (reciprocalCardinality === ONE) {
      const data = immutability.setOneRelationId(relatedOperation.data, reciprocalKey, operation.id);
      this.repository.setInPayload([relatedOperation.type, relatedOperation.id], { ...relatedOperation, data });
    }

    if (reciprocalCardinality === MANY) {
      const data = immutability.setManyRelationId(relatedOperation.data, reciprocalKey, operation.id, relatedIndex);
      this.repository.setInPayload([relatedOperation.type, relatedOperation.id], { ...relatedOperation, data });
    }
  }

  unlink(
    operation: Operation, relationKey: RelationKey, cardinality: Cardinality,
    relatedOperation: Operation, reciprocalKey: RelationKey, reciprocalCardinality: Cardinality,
  ) {
    if (cardinality === ONE && operation.data[relationKey] === relatedOperation.id) {
      const data = immutability.setOneRelationId(operation.data, relationKey, null);
      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });
    }

    if (cardinality === MANY && Array.isArray(operation.data[relationKey])) {
      const data = immutability.removeManyRelationId(operation.data, relationKey, relatedOperation.id, true);
      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });
    }

    if (reciprocalCardinality === ONE && relatedOperation.data[reciprocalKey] === operation.id) {
      const data = immutability.setOneRelationId(relatedOperation.data, reciprocalKey, null);
      this.repository.setInPayload([relatedOperation.type, relatedOperation.id], { ...relatedOperation, data });
    }

    if (reciprocalCardinality === MANY && Array.isArray(relatedOperation.data[reciprocalKey])) {
      const data = immutability.removeManyRelationId(relatedOperation.data, reciprocalKey, operation.id, true);
      this.repository.setInPayload([relatedOperation.type, relatedOperation.id], { ...relatedOperation, data });
    }
  }

  removeLinkedId(
    operation: Operation,
    relationKey: RelationKey,
    cardinality: Cardinality,
    linked: Id|Index,
    byId?: boolean
  ): Id|undefined {
    const linkData = operation.data[relationKey];

    if (!linkData) {
      return;
    }

    if (cardinality === ONE) {
      if (byId && linkData !== linked) {
        return;
      }

      const data = immutability.setOneRelationId(operation.data, relationKey, null);

      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });

      return linkData;
    }

    if (cardinality === MANY) {
      const index = byId ? linkData.indexOf(linked) : linked;

      if (index === -1) {
        return;
      }

      const linkedId = byId ? linked : linkData[index];

      const data = immutability.removeManyRelationId(operation.data, relationKey, index);

      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });

      return linkedId;
    }
  }
}
