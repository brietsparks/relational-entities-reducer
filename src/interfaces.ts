export type Type = string;
export type Id = string | number | symbol;
export type Data = { [s: string]: any };
export type Fkey = string;
export type CompositeId = string;

export type Cardinality = 'many' | 'one';
export const MANY = 'many';
export const ONE = 'one';


export type ResourcePointerTuple = [Type, Id];

export interface ResourcePointerObject {
  resourceType: Type;
  resourceId: Id;
}

export interface ActionResource<Options = object> extends ResourcePointerObject{
  data: Data;
  options: Options;
}

export type ResourceCollectionObjectById<Resource> = { [id in Id]: Resource };
export type ResourceCollectionMapById<Resource> = Map<Id, Resource>;
export type ResourceCollectionObjectByCid<Resource> = { [s in CompositeId]: Resource };
export type ResourceCollectionMapByCid<Resource> = Map<CompositeId, Resource>;

export type ResourceCollectionsByType<Collection> = {
  [type in Type]: Collection
}

export interface RelatedPointer {
  relatedType: Type,
  relatedId: Id,
  reciprocalFk: Fkey,
  reciprocalCardinality: Cardinality
}

export interface CollectionState {
  resources: ResourcesState,
  ids: IdsState
}

export type ResourcesState = { [id in Id]: Data };
export type IdsState = Id[];
export type State = { [type: string]: CollectionState }

export interface RelationRemovalCallback {
  (): RelationRemovalSchema;
}

export type RelationRemovalSchema = {
  [s in Fkey]: RelationRemovalSchema | RelationRemovalCallback
}
