export type Type = string;
export type Id = string | number;
export type Data = { [s: string]: any };
export type Fkey = string;

export type CompositeId = [Type, Id];
export type CompositeIdString = string;

export type RelatedPointer = {
  relatedType: Type,
  relatedId: Id,
  reciprocalFk: Fkey,
  reciprocalCardinality: Cardinality
};

export type CollectionState = {
  resources: ResourcesState,
  ids: IdsState
}

export interface R {
  [s: string]: string
}

export type ResourcesState = { [id in Id]: Data };
export type IdsState = Id[];
export type State = { [type: string]: CollectionState }

export const MANY = 'many';
export const ONE = 'one';

export type Cardinality = 'many' | 'one';

export const makeCompositeIdString = (type: Type, id: Id) => `${type}.${id}`;
