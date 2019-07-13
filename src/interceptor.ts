import { Model, State, Selectors, IndicesByRelation, RelationName, RelationKey } from './interfaces';

import Operations from './operations';
import Resource from './resource';
import { Action as InputAddAction } from './actions/add';
import { Action as InputRemoveAction } from './actions/remove';
import { Action as InputLinkAction } from './actions/link';
import { Action as InputUnlinkAction } from './actions/unlink';
import { isObjectLiteral } from './util';

export const onAdd = (model: Model, state: State, selectors: Selectors, inputAction: InputAddAction) => {
  const opUtil = new Operations(model, state, selectors, inputAction.operands);

  inputAction.operands.forEach(operand => {
    const { type, id, data, options } = operand;

    const resource = new Resource(model, state, type, id, data);

    resource.getLinks().forEach(({ relationName, linkedId, index }) => {
      const indexInLinked = getIndexByRelation(relationName, options.indicesByRelation);

      opUtil.link(type, id, relationName, linkedId, [index, indexInLinked]);
    });
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  }
};

export const onRemove = (model: Model, state: State, selectors: Selectors, inputAction: InputRemoveAction) => {
  const opUtil = new Operations(model, state, selectors);

  inputAction.operands.forEach(operand => {
    const { type, id, options } = operand;

    opUtil.remove(type, id, options.removeLinked);
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  }
};

export const onLink = (model: Model, state: State, selectors: Selectors, inputAction: InputLinkAction) => {
  const opUtil = new Operations(model, state, selectors);

  inputAction.definitions.forEach(definition => {
    const { type, id, relation, linkedId, indices } = definition;

    opUtil.link(type, id, relation, linkedId, indices);
  });

  return {
    type: inputAction.type,
    operands: opUtil.getOperands()
  };
};

export const onUnlink = (model: Model, state: State, selectors: Selectors, inputAction: InputUnlinkAction) => {
  const opUtil = new Operations(model, state, selectors);

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
