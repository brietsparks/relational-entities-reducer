import Model from '../model';
import { CidTuple, Data, Id, Operation, Operator, OpId, Type } from '../interfaces';
import { mergeMaps } from '../util';
import { OP_EDIT, OP_ADD } from '../constants';

export default class Repository {
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

  setInPayload(key: OpId|CidTuple, operation: Operation) {
    const opId = Repository.resolveOpId(key);
    this.touched.set(opId, operation);
  }

  removeFromPayload(key: OpId|CidTuple) {
    const opId = Repository.resolveOpId(key);

    this.initial.delete(opId);
    this.touched.delete(opId);
  }

  static resolveOpId(key: OpId|CidTuple) {
    return Array.isArray(key) ? Repository.makeOpId(key[0], key[1]) : key;
  }

  getFromPayload(type: Type, id: Id) {
    const opid = Repository.makeOpId(type, id);

    const touched = this.touched.get(opid);

    if (touched) {
      return touched;
    }

    return this.initial.get(opid);
  }

  // todo, refactor: options: { newIfNotFound, operator }
  getFromPayloadOrState(type: Type, id: Id, newIfNotFound?: boolean): Operation|undefined {
    const operation = this.getFromPayload(type, id);

    if (operation) {
      return operation;
    }

    let resource = this.model.getResource(type, id) ;

    if (!resource && !newIfNotFound) {
      return;
    }

    const operator = resource ? OP_EDIT : OP_ADD;
    const data = resource || {};

    return Repository.makeOperation(type, id, operator, data);
  }

  // todo: factor this out to makeCompositeId
  static makeOpId(type: Type, id: Id): OpId {
    return `${type}.${id}`;
  }

  static makeOperation(type: Type, id: Id, operator: Operator, data: Data): Operation {
    return { type, id, operator, data };
  }

  // payloadContains(type: Type, id: Id) {
  //   return !!this.getFromPayload(type, id);
  // }

  // getFromState(type: Type, id: Id): Operation|undefined {
  //   const resource = this.model.getResource(type, id);
  // }
}


