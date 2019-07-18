import { Cardinality, Data, Id, Index, Operation, OpId, RelationKey, RemoveOperation } from '../interfaces';
import { MANY, ONE } from '../constants';
import Repository from './repository';
import * as immutability from './immutability';

export default class Visitor {
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  link(
    recipient: Operation, giver: Operation, relationKey: RelationKey,
    cardinality: Cardinality, reciprocalKey: RelationKey, index?: Index
  ) {
    if (cardinality === ONE) {
      // the holder is a resource that already has the giver's id
      const holderId = giver.data[relationKey];
      const holder = this.repository.getFromPayloadOrState(recipient.type, holderId);

      // if there is a holder, then remove the giver's id from it
      if (holder) {
        const holderData = immutability.setOneRelationId(holder.data, reciprocalKey, null);
        this.repository.setInPayload([recipient.type, holderId], { ...holder, data: holderData });
      }

      // add the giver's id to the recipient
      const recipientData = immutability.setOneRelationId(recipient.data, relationKey, giver.id);
      this.repository.setInPayload([recipient.type, recipient.id], { ...recipient, data: recipientData });
    }

    if (cardinality === MANY) {
      const data = immutability.setManyRelationId(recipient.data, relationKey, giver.id, index);
      this.repository.setInPayload([recipient.type, recipient.id], { ...recipient, data });
    }
  }

  remove(operations: RemoveOperation) {

  }

  unlink(
    operation: Operation,
    relationKey: RelationKey,
    cardinality: Cardinality,
    linked: Id|Index,
    byId?: boolean
  ) {
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
      return;
    }

    if (cardinality === MANY) {
      const index = byId ? linkData.indexOf(linked) : linked;

      if (index === -1) {
        return;
      }

      const data = immutability.removeManyRelationId(operation.data, relationKey, index);

      this.repository.setInPayload([operation.type, operation.id], { ...operation, data });
      return;
    }
  }
}
