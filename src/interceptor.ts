import {
  IndicesByRelation,
  RelationName,
  RelationKey,
  Type,
  Cardinality,
  Operation,
  OpId,
  AddOperation, RemoveOperation, LinkDefinition, CidString, UnlinkDefinition
} from './interfaces';

import Model from './model';
import { Repository, Visitor } from './operations';
import { isObjectLiteral } from './util';
import { OP_EDIT } from './operations/repository';

// todo: ignoreIdIndex
export const transformAddOperations = (model: Model, operations: Map<OpId, AddOperation>) => {
  const repository = new Repository(model, operations);
  const visitor = new Visitor(repository);

  operations.forEach(({ type, id, data, options }) => {
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

  operations.forEach(({ type, id, options: { removeLinked } }) => {
    const data = model.getResource(type, id);

    if (!data) {
      return;
    }

    const links = model.extractAllLinks(type, data);

    links.forEach(({ relatedType, linkedId, relationKey }) => {
      const { reciprocalKey, reciprocalCardinality } = model.getEntity(type).getRelationDefinition(relationKey);

      const relatedOperation = repository.getFromPayloadOrState(relatedType, linkedId);

      if (!relatedOperation) {
        return;
      }

      visitor.unlink(relatedOperation, reciprocalKey, reciprocalCardinality, id, true);
    });
  });

  return repository.getPayload();
};

export const transformLinkDefinitions = (model: Model, definitions: Map<CidString, LinkDefinition>) => {
  const repository = new Repository(model);
  const visitor = new Visitor(repository);

  definitions.forEach(({ type, id, relation, linkedId, indices }) => {
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

export const transformUnlinkDefinitions = (model: Model, definitions: Map<CidString, UnlinkDefinition>) => {
  const repository = new Repository(model);
  const visitor = new Visitor(repository);

  definitions.forEach(({ id, type, relation, linked, byId }) => {
    const relationKey = model.getRelationKey(type, relation);

    const {
      reciprocalKey,
      reciprocalCardinality,
      cardinality,
      relatedType,
    } = model.getEntity(type).getRelationDefinition(relationKey);

    const operation = repository.getFromPayloadOrState(type, id);
    if (!operation) {
      return;
    }

    const unlinkedId = visitor.unlink(operation, relationKey, cardinality, linked, byId);
    if (!unlinkedId) {
      return;
    }

    const relatedOperation = repository.getFromPayloadOrState(relatedType, unlinkedId);
    if (!relatedOperation) {
      return;
    }

    visitor.unlink(relatedOperation, reciprocalKey, reciprocalCardinality, id, true);
  });

  return repository.getPayload();
};

const getIndexByRelation = (relation: RelationKey, indicesByRelation?: IndicesByRelation): number|undefined => {
  if (indicesByRelation && isObjectLiteral(indicesByRelation)) {
    return indicesByRelation[relation]
  }
};
