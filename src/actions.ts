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

export const createActions = ({
  namespace = defaultNamespace,
  resourceTypeKey = defaultResourceTypeKey,
  resourceIdKey = defaultResourceIdKey,
  resourceKey = defaultResourceKey,
  resourcesKey = defaultResourcesKey
}: Options = {}) => {
  const ADD = namespace('ADD');
  const ADD_MANY = namespace('ADD_MANY');
  const CHANGE = namespace('CHANGE');
  const CHANGE_MANY = namespace('CHANGE_MANY');
  const REMOVE = namespace('REMOVE');
  const REMOVE_MANY = namespace('REMOVE_MANY');

  const add = (resourceType: ResourceType, resourceId: ResourceId, resource?: Resource, index?: number) => {
    return {
      type: ADD,
      [resourceTypeKey]: resourceType,
      [resourceIdKey]: resourceId,
      [resourceKey]: resource,
      index
    };
  };

  const addMany = (resources: [ResourceType, ResourceId, Resource, number?][] = []) => ({
    type: ADD_MANY,
    [resourcesKey]: resources
  });

  const change = (resourceType: ResourceType, resourceId: ResourceId, resource: Resource) => ({
    type: CHANGE,
    [resourceTypeKey]: resourceType,
    [resourceIdKey]: resourceId,
    [resourceKey]: resource
  });

  const changeMany = (resources: [ResourceType, ResourceId, Resource, number?][] = []) => ({
    type: CHANGE_MANY,
    [resourcesKey]: resources
  });

  const remove = (resourceType: ResourceType, resourceId: ResourceId) => ({
    type: REMOVE,
    [resourceTypeKey]: resourceType,
    [resourceIdKey]: resourceId,
  });

  const removeMany = (resources: [ResourceType, ResourceId][] = []) => ({
    type: REMOVE_MANY,
    [resourcesKey]: resources
  });

  return {
    ADD,
    ADD_MANY,
    CHANGE,
    CHANGE_MANY,
    REMOVE,
    REMOVE_MANY,
    add,
    addMany,
    change,
    changeMany,
    remove,
    removeMany,
  };
};
