import {
  AddOperand,
  Data,
  Id,
  Index,
  LinkRemovalSchema,
  Model,
  Operand,
  OpId,
  RelationKey,
  RelationName,
  Selectors,
  State,
  Type
} from './interfaces';

const EDIT = 'edit';
const ADD = 'add';
const REMOVE = 'remove';

const makeOpId = (type: Type, id: Id): OpId => {
  return `${type}.${id}`;
};

const mockOperandMap = (type: Type, id: Id): Map<OpId, AddOperand> => {
  const opId = makeOpId(type, id);
  return new Map(Object.entries({
    [opId]: {
      type: type,
      id: id,
      data: {},
      options: {},
      operator: ADD,
    }
  }));
};

export default class Operations {
  model: Model;
  state: State;
  selectors: Selectors;
  operands: Map<OpId, Operand>;

  constructor(model: Model, state: State, selectors: Selectors, operands?: Map<OpId, Operand>) {
    this.model = model;
    this.state = state;
    this.selectors = selectors;
    this.operands = operands || new Map<OpId, Operand>();
  }

  getOperands(): Map<OpId, Operand> {
    return this.operands;
  }

  link(
    type: Type, id: Id, relation: RelationName | RelationKey, linkableId: Id, indices?: [Index?, Index?]
  ): Operations {
    // if the reciprocal cardinality is one and has a link
    // then detach the occupant resource from the linkable resource

    return this;
  }

  unlink(
    type: Type, id: Id, relation: RelationName | RelationKey, link: Index | Id, byId?: boolean
  ): Operations {
    return this;
  }

  remove(type: Type, id: Id, removeLinked?: LinkRemovalSchema) {
    // recursively: remove linked, remove relations
    return this;
  }

  private findOperand(type: Type, id: Id) {
    const operand = this.getOperand(type, id);

    if (operand) {
      return operand;
    }

    return this.selectors.getResource(this.state, { type, id });
  }

  private getOperand(type: Type, id: Id) {
    const opid = makeOpId(type, id);
    return this.operands.get(opid);
  }

  private makeOpId(type: Type, id: Id): OpId {
    return `${type}.${id}`;
  }

  private setOperand(type: Type, id: Id, operand: Operand) {
    const opid = makeOpId(type, id);
    this.operands.set(opid, operand);
  }

  private addRelatedIdToData(type: Type, id: Id, data: Data, relatedType: Type, relatedId: Id) {
    // pass in existing data, check one/many, set the relatedId in the data
  }
}
