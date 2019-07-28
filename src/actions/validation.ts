import { Entities } from '../schema';
import { Data, RelationKey, Id, Type } from '../interfaces';
import { isStringOrNumber, isObjectLiteral, isString } from '../util';

interface BatchItem {
  type: Type,
  id: Id,
  data?: Data,
  options?: object
}

export const validateResourceType = (resourceType: Type, entities: Entities) => {
  if (!entities.hasEntity(resourceType)) {
    throw new Error (`entity of type "${resourceType}" does not exist`);
  }
};

export const validateResourceId = (resourceId: Id) => {
  if (!isStringOrNumber(resourceId)) {
    throw new Error(`resource id must be a string or number`)
  }
};

export const validateResourceData = (data?: Data, isRequired = false) => {
  if ((data || isRequired) && !isObjectLiteral(data)) {
    throw new Error(`resource data must be an object literal`);
  }
};

export const validateResourceOptions = (options?: object, isRequired = false) => {
  if ((options || isRequired) && !isObjectLiteral(options)) {
    throw new Error(`resource options must be an object literal`);
  }
};

export const validateRelation = (entities: Entities, resourceType: Type, relation: RelationKey) => {
  if (!isString(relation)) {
    throw new Error('relation key must be a string');
  }

  const hasRelation = entities.getEntity(resourceType).hasRelation(relation);

  if (!hasRelation) {
    throw entities.getEntity(resourceType).errorRelationDoesNotExist(relation);
  }
};

export const validateIndex = (index: number) => {
  if (typeof index !== 'number' || !Number.isInteger(index)) {
    throw new Error('index must be an integer');
  }
};

export const validateBatchItem = (entities: Entities, item: BatchItem) => {
  const { type, id, data, options } = item;

  if (!entities.hasEntity(type)) {
    throw new Error (`entity of type "${type}" does not exist`);
  }

  if (!isStringOrNumber(id)) {
    throw new Error(`resource id must be a string or number`)
  }

  if (data && !isObjectLiteral(data)) {
    throw new Error(`resource data must be an object literal`);
  }

  if (options && !isObjectLiteral(options)) {
    throw new Error(`resource options must be an object literal`);
  }
};
