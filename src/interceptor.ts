import { IndicesByRelation, RelationName, RelationKey, Type, Cardinality, Operation, OpId } from './interfaces';

import Model from './model';
import { Repository, injectLinkData } from './operations';
import { Action as InputAddAction } from './actions/add';
import { Action as InputRemoveAction } from './actions/remove';
import { Action as InputLinkAction } from './actions/link';
import { Action as InputUnlinkAction } from './actions/unlink';
import { isObjectLiteral } from './util';

export const onAdd = (model: Model, inputAction: InputAddAction) => {
  const repository = new Repository(model, inputAction.operations);

  inputAction.operations.forEach(initialOperation => {
    const { type, id, data, options } = initialOperation;

    if (model.hasResource(type, id)) {
      return;
    }

    repository.addToPayload([type, id], initialOperation);

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
      const injected: Map<OpId, Operation> = injectLinkData(
        repository, operation, relatedOperation, relationKey,
        cardinality, reciprocalKey, index
      );

      const indexInLinked = getIndexByRelation(relationKey, options.indicesByRelation);

      const injectedRelated: Map<OpId, Operation> = injectLinkData(
        repository, relatedOperation, operation, reciprocalKey,
        reciprocalCardinality, relationKey, indexInLinked
      );

      // add the results to the repository
      injected.forEach((op, opId) => repository.addToPayload(opId, op));
      injectedRelated.forEach((op, opId) => repository.addToPayload(opId, op));
    });
  });

  return {
    type: inputAction.type,
    operations: repository.getPayload()
  }
};

// export const onRemove = (model: Model, inputAction: InputRemoveAction) => {
//   const builder = new OperationsBuilder(model);
//
//   inputAction.operations.forEach(operation => {
//     const { type, id, options } = operation;
//
//     if (!model.hasResource(type, id)) {
//       return;
//     }
//
//     builder.remove(type, id, options.removeLinked);
//   });
//
//   return {
//     type: inputAction.type,
//     operations: builder.getOperations()
//   }
// };
//
// export const onLink = (model: Model, inputAction: InputLinkAction) => {
//   const builder = new OperationsBuilder(model);
//
//   inputAction.definitions.forEach(definition => {
//     const { type, id, relation, linkedId, indices } = definition;
//
//     const relationType = model.getRelationType(type, relation);
//
//     if (!model.hasResource(type, id) || model.hasResource(relationType, linkedId)) {
//       return;
//     }
//
//     const relationKey = model.getRelationKey(type, relation);
//
//     builder.link(type, id, relationKey, linkedId, indices);
//   });
//
//   return {
//     type: inputAction.type,
//     operations: builder.getOperations()
//   };
// };
//
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
