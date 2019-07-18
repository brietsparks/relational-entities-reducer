import {
  IndicesByRelation,
  RelationName,
  RelationKey,
  Type,
  Cardinality,
  Operation,
  OpId,
  AddOperation, RemoveOperation, LinkDefinition, CidString
} from './interfaces';

import Model from './model';
import { Repository, Visitor } from './operations';
import { Action as InputAddAction } from './actions/add';
import { Action as InputRemoveAction } from './actions/remove';
import { Action as InputLinkAction } from './actions/link';
import { Action as InputUnlinkAction } from './actions/unlink';
import { isObjectLiteral } from './util';

export const transformAddOperations = (model: Model, operations: Map<OpId, AddOperation>) => {
  const repository = new Repository(model, operations);
  const visitor = new Visitor(repository);

  operations.forEach(initialOperation => {
    const { type, id, data, options } = initialOperation;

    if (model.hasResource(type, id)) {
      return;
    }

    const entity = model.getEntity(type);

    const links = model.extractAllLinks(type, data);
    links.forEach(({ relationKey, linkedId, index }) => {
      const { reciprocalKey, relatedType, cardinality, reciprocalCardinality } = entity.getRelationDefinition(relationKey);

      // retrieve the operations
      let operation = repository.getFromPayload(type, id);
      let relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId, true);
      if (!operation || !relatedOperation) {
        return;
      }

      // link the operands together
      const indexInLinked = getIndexByRelation(relationKey, options.indicesByRelation);
      visitor.link(operation, relatedOperation, relationKey, cardinality, reciprocalKey, index);
      visitor.link(relatedOperation, operation, reciprocalKey, reciprocalCardinality, relationKey, indexInLinked);
    });
  });

  return repository.getPayload();
};

export const transformRemoveOperations = (model: Model, operations: Map<OpId, RemoveOperation>) => {
  const repository = new Repository(model, operations);
  const visitor = new Visitor(repository);

  operations.forEach(operation => {
    const { type, id } = operation;

    if (!model.hasResource(type, id)) {
      return;
    }

    visitor.remove(operation)
  });

  return repository.getPayload();
};

export const transformLinkDefinitions = (model: Model, definitions: Map<CidString, LinkDefinition>) => {
  const repository = new Repository(model);
  const visitor = new Visitor(repository);

  definitions.forEach(definition => {
    const { type, id, relation, linkedId, indices } = definition;

    const relationKey = model.getRelationKey(type, relation);

    const {
      reciprocalKey,
      reciprocalCardinality,
      cardinality,
      relatedType,
    } = model.getEntity(type).getRelationDefinition(relationKey);

    const operation = repository.getFromPayloadOrState(type, id);
    const relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

    if (!operation || !relatedOperation) {
      return;
    }

    visitor.link(operation, relatedOperation, relationKey, cardinality, reciprocalKey, indices[0]);
    visitor.link(relatedOperation, operation, reciprocalKey, reciprocalCardinality, relationKey, indices[1]);
  });

  return repository.getPayload();
};

// export const onUnlink = (model: Model, inputAction: InputUnlinkAction) => {
//   const builder = new OperationsBuilder(model);
//
//   inputAction.definitions.forEach(definition => {
//     const { type, id, relation, linked, byId } = definition ;
//
//     if (!model.hasResource(type, id)) {
//       return;
//     }
//
//     builder.unlink(type, id, relation, linked, byId);
//   });
//
//   return {
//     type: inputAction.type,
//     operations: builder.getOperations()
//   };
// };

const getIndexByRelation = (relation: RelationKey, indicesByRelation?: IndicesByRelation): number|undefined => {
  if (indicesByRelation && isObjectLiteral(indicesByRelation)) {
    return indicesByRelation[relation]
  }
};
