import {
  CompositeId,
  Data,
  EntityState,
  Selectors,
  State,
  Type,
  CidTuple,
  CidObject,
  ResourcesState, Id
} from './interfaces';
import { isObjectLiteral } from './util';
import { Entities } from './schema';

export const makeSelectors = (entities: Entities): Selectors => {
  const getEntityState = (state: State, type: Type): EntityState => {
    const entityState = state[type];

    if (!entityState) {
      // todo: throw
    }

    return entityState;
  };

  const getEntityResources = (state: State, type: Type): ResourcesState => {
    const entityState = getEntityState(state, type);
    const { resources } = entityState;

    if (!resources) {
      // todo: throw
    }

    return resources;
  };

  const getEntityIds = (state: State, { type }: { type: Type }): Id[] => {
    const entityState = getEntityState(state, type);
    const { ids } = entityState;

    if (!ids) {
      // todo: throw
    }

    return ids;
  };

  const getResource = (state: State, cid: CompositeId): Data => {
    const { type, id } = convertCidToObject(cid);
    const resources = getEntityResources(state, type);
    return resources[id];
  };

  return {
    getEntityIds,
    getResource,
  };
};

export const convertCidToObject = (compositeId: CompositeId): CidObject => {
  if (Array.isArray(compositeId)) {
    validateCidTuple(compositeId);
    return {
      type: compositeId[0],
      id: compositeId[1]
    };
  }

  if (isObjectLiteral(compositeId)) {
    validateCidObject(compositeId);
    return compositeId;
  }

  if (typeof compositeId === 'string') {
    // todo validate
    const parts = compositeId.split('.');
    return {
      type: parts[0],
      id: parts[1]
    };
  }

  throw new Error('invalid composite id');
};

const validateCidTuple = (cid: CidTuple) => {
  if (cid.length < 2) {
    throw new Error('CompositeId array must be a tuple: [type, id]');
  }
};

const validateCidObject = (cid: CidObject) => {
  // todo
};
