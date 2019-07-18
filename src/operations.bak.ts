import Model from './model';
import { Cardinality, Data, Id, Index, Operation, Operator, OpId, CidTuple, RelationKey, Type } from './interfaces';
import { MANY, ONE } from './constants';
import { mergeMaps } from './util';

export const OP_EDIT = 'edit';
export const OP_ADD = 'add';
export const OP_REMOVE = 'remove';

export class Visitor {
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
        const holderData = immutability.withOneRelationId(holder.data, reciprocalKey, null);
        this.repository.setInPayload([recipient.type, holderId], { ...holder, data: holderData });
      }

      // add the giver's id to the recipient
      const recipientData = immutability.withOneRelationId(recipient.data, relationKey, giver.id);
      this.repository.setInPayload([recipient.type, recipient.id], { ...recipient, data: recipientData });
    }

    if (cardinality === MANY) {
      const data = immutability.withManyRelationId(recipient.data, relationKey, giver.id, index);
      this.repository.setInPayload([recipient.type, recipient.id], { ...recipient, data });
    }
  }
}

export const injectLinkData = (
  repository: Repository, recipient: Operation, giver: Operation,
  relationKey: RelationKey, cardinality: Cardinality, reciprocalKey: RelationKey, index?: Index
): Map<OpId, Operation> => {
  const output = new Map<OpId, Operation>();

  if (cardinality === ONE) {
    // the holder is a resource that already has the giver's id
    const holderId = giver.data[relationKey];
    const holder = repository.getFromPayloadOrState(recipient.type, holderId);

    // if there is a holder, then remove the giver's id from it
    if (holder) {
      const holderData = immutability.withOneRelationId(holder.data, reciprocalKey, null);
      output.set(
        Repository.makeOpId(recipient.type, holderId),
        { ...holder, data: holderData }
      );
    }

    // add the giver's id to the recipient
    const recipientData = immutability.withOneRelationId(recipient.data, relationKey, giver.id);
    output.set(
      Repository.makeOpId(recipient.type, recipient.id),
      { ...recipient, data: recipientData }
    );
  }

  if (cardinality === MANY) {
    const data = immutability.withManyRelationId(recipient.data, relationKey, giver.id, index);
    output.set(
      Repository.makeOpId(recipient.type, recipient.id),
      { ...recipient, data }
    );
  }

  return output;
};

export const immutability = {
  withOneRelationId: (data: Data, relationKey: RelationKey, id: Id|null) => {
    return { ...data, [relationKey]: id };
  },
  withManyRelationId: (data: Data, relationKey: RelationKey, id: Id, index?: Index) => {
    // make sure the ids are an array
    const relationData = Array.isArray(data[relationKey]) ? data[relationKey] : [];

    // add the id
    if (!relationData.includes(id)) {
      index ? relationData.splice(index, 0, id) : relationData.push(id);
    }

    return { ...data, [relationKey]: relationData };
  },
};

export class Repository {
  model: Model;
  initial: Map<OpId, Operation>;
  touched: Map<OpId, Operation>;

  constructor(model: Model, operations?: Map<OpId, Operation>) {
    this.model = model;
    this.initial = operations instanceof Map ? operations : new Map<OpId, Operation>();
    this.touched = new Map<OpId, Operation>();
  }

  getPayload(): Map<OpId, Operation> {
    return mergeMaps(this.initial, this.touched);
  }

  getFromPayload(type: Type, id: Id) {
    const opid = Repository.makeOpId(type, id);

    const touched = this.touched.get(opid);

    if (touched) {
      return touched;
    }

    return this.initial.get(opid);
  }

  payloadContains(type: Type, id: Id) {
    return !!this.getFromPayload(type, id);
  }

  setInPayload(key: OpId|CidTuple, operation: Operation) {
    const opId = Array.isArray(key) ? Repository.makeOpId(key[0], key[1]) : key;
    this.touched.set(opId, operation);
  }

  getFromPayloadOrState(type: Type, id: Id, additive?: boolean): Operation|undefined {
    const operation = this.getFromPayload(type, id);

    if (operation) {
      return operation;
    }

    const resource = this.model.getResource(type, id) ;

    if (!resource && !additive) {
      return;
    }

    const operator = resource ? OP_EDIT : OP_ADD;

    return Repository.makeOperation(type, id, operator, resource);
  }

  static makeOpId(type: Type, id: Id): OpId {
    return `${type}.${id}`;
  }

  static makeOperation(type: Type, id: Id, operator: Operator, data: Data): Operation {
    return { type, id, operator, data };
  }
}
