import Model from './model';
import {
  AddOperand,
  Data,
  Id,
  Index,
  LinkRemovalSchema,
  Operand, Operator,
  OpId,
  RelationKey,
  RelationName,
  Selectors,
  State,
  Type
} from './interfaces';

import { makeOpId } from './util';
import { MANY, ONE } from './constants';
// import Resource from './resource';

export const OP_EDIT = 'edit';
export const OP_ADD = 'add';
export const OP_REMOVE = 'remove';

export default class OperationsBuilder {
  model: Model;
  initial: Map<OpId, Operand>;
  changed: Map<OpId, Operand>;

  constructor(model: Model, operands?: Map<OpId, Operand>) {
    this.model = model;
    this.initial = operands instanceof Map ? operands : new Map<OpId, Operand>();
    this.changed = new Map<OpId, Operand>();
  }

  getOperands(): Map<OpId, Operand> {
    return this.changed;
  }

  getOperand(type: Type, id: Id) {
    const opid = makeOpId(type, id);

    const changed = this.changed.get(opid);

    if (changed) {
      return changed;
    }

    return this.initial.get(opid);
  }

  hasOperand(type: Type, id: Id) {
    return !!this.getOperand(type, id);
  }

  newOperand(type: Type, id: Id, operator: Operator) {
    this.setOperand(type, id, { type, id, operator });
  }

  setOperand(type: Type, id: Id, operand: Operand) {
    const opid = makeOpId(type, id);
    this.changed.set(opid, operand);
  }

  removeOperand(type: Type, id: Id) {

  }

  link(
    type: Type,
    id: Id,
    relation: RelationName | RelationKey,
    linkableId: Id,
    indices?: [Index?, Index?],
  ): OperationsBuilder {
    const entity = this.model.getEntity(type);

    // the cardinality of the linkable to the subject
    const relatedReciprocalCardinality = entity.getRelatedReciprocalCardinality(relation);

    if (relatedReciprocalCardinality === ONE) {
      const linkableType = this.model.getRelationType(relation);
      const linkableOperand = this.getOperand(linkableType, linkableId);
      // const occupantResourceId = linkableResource.getLinkId(type);

      if (occupantResourceId) {
        // if the reciprocal cardinality is one and has a link,
        // then detach the occupant resource from the linkable resource
        const occupantResource = this.model.getResource(type, occupantResourceId);
      }
    }

    return this;
  }

  unlink(
    type: Type, id: Id, relation: RelationName | RelationKey, link: Index | Id, byId?: boolean
  ): OperationsBuilder {
    return this;
  }

  remove(type: Type, id: Id, removeLinked?: LinkRemovalSchema) {
    // recursively: remove linked, remove relations
    return this;
  }

  private makeOperand(type: Type, id: Id, operator: Operator): Operand {
    return { type, id, operator }
  }

  // private findOperand(type: Type, id: Id, operator: Operator, fallbackToState?: boolean): Operand|undefined {
  //   const operand = this.getOperand(type, id);
  //
  //   if (operand || !fallbackToState) {
  //     return operand;
  //   }
  //
  //   const data = this.model.getResource(type, id);
  //
  //   if (data) {
  //     return { type, id, operator, ...data };
  //   }
  // }

  private makeOpId(type: Type, id: Id): OpId {
    return `${type}.${id}`;
  }

  private editOperandLinkData(
    type: Type,
    id: Id,
    relation: RelationName|RelationKey,
    cb: (data: Data) => Data
  ) {

  }

  private addRelatedIdToData(type: Type, id: Id, data: Data, relatedType: Type, relatedId: Id) {
    // pass in existing data, check one/many, set the relatedId in the data
  }
}
