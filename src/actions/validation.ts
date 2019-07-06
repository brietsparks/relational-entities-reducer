import { Model } from '../model';
import { Data, Id, Type } from '../model/resource';
import { isStringOrNumber, isObject } from '../util';

interface BatchItem {
  resourceType: Type,
  resourceId: Id,
  data?: Data,
  options?: object
}

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
