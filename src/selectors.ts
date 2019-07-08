import { Data, State, Type, ResourcePointerTuple } from './interfaces';
import { isObject } from './util';

export class InvalidState extends Error {}

export const getCollection = (state: State, type: Type) => {
  const collection = state[type];

  if (!isObject(collection)) {
    throwDataTypeError(`collection of "${type}"`, 'object literal');
  }

  return collection;
};

export const getResources = (state: State, type: Type) => {
  const collection = getCollection(state, type);

  const resources = collection.resources;

  if (!isObject(resources)) {
    throwDataTypeError(`resources of "${type}" collection`, 'object literal');
  }

  return resources;
};

export const getIds = (state: State, type: Type) => {
  const collection = getCollection(state, type);

  const ids = collection.ids;

  if (!Array.isArray(ids)) {
    throwDataTypeError(`ids of "${type}" collection`, 'array');
  }

  return ids;
};

export const getResource = (state: State, [type, id]: ResourcePointerTuple): Data => {
  const resources = getResources(state, type);
  return resources[id];
};

export const getDoesResourceExist = (state: State, [type, id]: ResourcePointerTuple): boolean  => {
  return !!getResource(state, [type, id]);
};

const throwDataTypeError = (subject: string, requiredDataType: string) => {
  throw new InvalidState(`${subject} must be a(n) ${requiredDataType}`);
};
