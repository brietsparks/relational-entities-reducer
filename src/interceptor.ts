import { IndicesByRelation, RelationName, RelationKey } from './interfaces';

import Model from './model';
import OperationsBuilder, { OP_ADD, OP_EDIT } from './operations';
import { Action as InputAddAction } from './actions/add';
import { Action as InputRemoveAction } from './actions/remove';
import { Action as InputLinkAction } from './actions/link';
import { Action as InputUnlinkAction } from './actions/unlink';
import { isObjectLiteral } from './util';

export const onAdd = (model: Model, inputAction: InputAddAction) => {
  const opUtil = new OperationsBuilder(model, inputAction.operands);

  inputAction.operands.forEach(operand => {
    const { type, id, data, options } = operand;

    const links = model.extractLinks(type, id, data);

    links.forEach(({ relationName, linkedId, index }) => {
      const relationType = model.getRelationType(type, relationName);

      const linkedExistsInOperands = opUtil.hasOperand(relationType, linkedId);

      if (!linkedExistsInOperands) {
        const linkedOperator = model.hasResource(relationType, linkedId) ? OP_EDIT : OP_ADD;

        opUtil.newOperand(relationType, linkedId, linkedOperator);
      }

      const indexInLinked = getIndexByRelation(relationName, options.indicesByRelation);

      opUtil.link(type, id, relationName, linkedId, [index, indexInLinked]);
    });
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  }
};

export const onRemove = (model: Model, inputAction: InputRemoveAction) => {
  const opUtil = new OperationsBuilder(model);

  inputAction.operands.forEach(operand => {
    const { type, id, options } = operand;



    opUtil.remove(type, id, options.removeLinked);
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  }
};

export const onLink = (model: Model, inputAction: InputLinkAction) => {
  const opUtil = new OperationsBuilder(model);

  inputAction.definitions.forEach(definition => {
    const { type, id, relation, linkedId, indices } = definition;



    if (!model.hasResource(type, id) || model.) {
      return;
    }

    opUtil.link(type, id, relation, linkedId, indices);
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  };
};

export const onUnlink = (model: Model, inputAction: InputUnlinkAction) => {
  const opUtil = new OperationsBuilder(model);

  inputAction.definitions.forEach(definition => {
    const { type, id, relation, linked, byId } = definition ;

    opUtil.unlink(type, id, relation, linked, byId);
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  };
};

const getIndexByRelation = (
  relation: RelationName|RelationKey,
  indicesByRelation?: IndicesByRelation
): number|undefined => {
  if (indicesByRelation && isObjectLiteral(indicesByRelation)) {
    return indicesByRelation[relation]
  }
};
