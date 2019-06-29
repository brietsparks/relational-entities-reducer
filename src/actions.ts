const defaultNamespace = (actionType: string) => `entities.${actionType}`;
const defaultResourceTypeKey = 'resourceType';
const defaultResourceIdKey = 'resourceId';
const defaultResourceKey = 'resource';
const defaultResourcesKey = 'resources';

type Options = {
  namespace?: (s: string) => string,
  resourceTypeKey?: string,
  resourceIdKey?: string,
  resourceKey?: string,
  resourcesKey?: string
}

type ResourceType = string;
type ResourceId = string | number;
type Resource = object;

type AddOptions = {
  index?: number,
  addRelated?: boolean
}

type EditOptions = {
}

type RemoveOptions = {
  removeRelated?: RelationChain
}

type RelationChain = string[][]

export const createActions = (
  // model: Model, // model will be needed for action param validation
  {
    namespace = defaultNamespace,
    resourceTypeKey = defaultResourceTypeKey,
    resourceIdKey = defaultResourceIdKey,
    resourceKey = defaultResourceKey,
    resourcesKey = defaultResourcesKey
  }: Options = {}
) => {
  const ADD = namespace('ADD');
  const ADD_BATCH = namespace('ADD_BATCH');
  const CHANGE = namespace('CHANGE');
  const CHANGE_BATCH = namespace('CHANGE_BATCH');
  const REMOVE = namespace('REMOVE');
  const REMOVE_BATCH = namespace('REMOVE_BATCH');

  const add = (
    resourceType: ResourceType,
    resourceId: ResourceId,
    resource?: Resource,
    options?: AddOptions
  ) => {
    return {
      type: ADD,
      [resourceTypeKey]: resourceType,
      [resourceIdKey]: resourceId,
      [resourceKey]: resource,
      options
    };
  };

  const addBatch = (...resources: [ResourceType, ResourceId, Resource?, AddOptions?][]) => ({
    type: ADD_BATCH,
    [resourcesKey]: resources
  });

  const change = (
    resourceType: ResourceType,
    resourceId: ResourceId,
    resource: Resource
  ) => ({
    type: CHANGE,
    [resourceTypeKey]: resourceType,
    [resourceIdKey]: resourceId,
    [resourceKey]: resource
  });

  const changeBatch = (...resources: [ResourceType, ResourceId, Resource, number?][]) => ({
    type: CHANGE_BATCH,
    [resourcesKey]: resources
  });

  const remove = (
    resourceType: ResourceType,
    resourceId: ResourceId,
    options?: RemoveOptions
  ) => ({
    type: REMOVE,
    [resourceTypeKey]: resourceType,
    [resourceIdKey]: resourceId,
    options
  });

  const removeBatch = (...resources: [ResourceType, ResourceId][]) => ({
    type: REMOVE_BATCH,
    [resourcesKey]: resources
  });

  return {
    ADD,
    ADD_BATCH,
    CHANGE,
    CHANGE_BATCH,
    REMOVE,
    REMOVE_BATCH,
    add,
    addBatch,
    change,
    changeBatch,
    remove,
    removeBatch,
  };
};
