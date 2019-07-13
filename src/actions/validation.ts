import { Model } from '../model';
import { Data, Fkey, Id, Type } from '../interfaces';
import { isStringOrNumber, isObject, isString } from '../util';

interface BatchItem {
  resourceType: Type,
  resourceId: Id,
  data?: Data,
  options?: object
}

export const validateResourceType = (resourceType: Type, model: Model) => {
  if (!model.hasEntity(resourceType)) {
    throw new Error (`model does not have an entity of type "${resourceType}"`);
  }
};

export const validateResourceId = (resourceId: Id) => {
  if (!isStringOrNumber(resourceId)) {
    throw new Error(`resource id must be a string or number`)
  }
};

export const validateResourceData = (data?: Data, isRequired = false) => {
  if ((data || isRequired) && !isObject(data)) {
    throw new Error(`resource data must be an object literal`);
  }
};

export const validateResourceOptions = (options?: object, isRequired = false) => {
  if ((options || isRequired) && !isObject(options)) {
    throw new Error(`resource options must be an object literal`);
  }
};

export const validateFk = (model: Model, resourceType: Type, fk: Fkey) => {
  if (!isString(fk)) {
    throw new Error('foreign key must be a string');
  }

  const hasFk = model.getEntity(resourceType).hasFk(fk);

  if (!hasFk) {
    throw new Error(`resource of type "${resourceType}" does not contain a foreign key "${fk}"`);
  }
};

export const validateIndex = (index: number) => {
  if (typeof index !== 'number' || !Number.isInteger(index)) {
    throw new Error('index must be an integer');
  }

  if (index < 0) {
    throw new Error('index must be greater than 0');
  }
};

export const validateBatchItem = (model: Model, item: BatchItem) => {
  const { resourceType, resourceId, data, options } = item;

  if (!model.hasEntity(resourceType)) {
    throw new Error (`model does not have an entity of type "${resourceType}"`);
  }

  if (!isStringOrNumber(resourceId)) {
    throw new Error(`resource id must be a string or number`)
  }

  if (data && !isObject(data)) {
    throw new Error(`resource data must be an object literal`);
  }

  if (options && !isObject(options)) {
    throw new Error(`resource options must be an object literal`);
  }
};
