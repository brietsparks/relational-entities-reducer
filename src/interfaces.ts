export type State = { [type: string]: EntityState }
export interface EntityState {
  resources: ResourcesState,
  ids: IdsState
}
export type ResourcesState = { [id in Id]: Data };
export type IdsState = Id[];


export type Id = number | string;
export type Type = string;
export type RelationKey = string;
export type RelationName = string;
export type Data = { [s in string]: any };
export type Cardinality = 'many' | 'one';
export type Index = number;

export type CidString = string;
export type CidObject = { type: Type, id: Id };
export type CidTuple = [Type, Id];
export type CompositeId = CidString | CidObject | CidTuple;

export interface Link {
  linkedId: Id,
  relatedType: Type,
  relationName: RelationName,
  relationKey: RelationKey,
  index?: Index,
}

export interface LinkRemovalCallback {
  (): LinkRemovalSchema;
}

export type LinkRemovalSchema = {
  [s in RelationKey|RelationName]: LinkRemovalSchema | LinkRemovalCallback
}

export interface Action {
  type: string
}

export type OpId = string;

export type Operator = 'add' | 'edit' | 'remove';

export type IndicesByRelation = { [s in RelationName | RelationKey]: Index };
export type IndicesByRelationKey = {[s in RelationKey]: Index };

export type OperationsByType = { [type in Type]: Map<Id, Operation> };

export interface Operation {
  type: Type,
  id: Id,
  operator: Operator,
  data: Data
}

export interface AddOperation extends Operation {
  options: AddOptions;
  operator: 'add';
}

export interface RemoveOperation extends Operation {
  options: RemoveOptions,
  operator: 'remove'
}

export interface EditOperation extends Operation {
  options: EditOptions;
  operator: 'edit';
}

export interface AddOptions {
  index?: Index;
  indicesByRelation?: IndicesByRelation;
  ignoreIdIndex?: boolean;
}

export interface RemoveOptions {
  removalSchema?: LinkRemovalSchema
}

export interface EditOptions {
  index?: Index
}

export interface LinkDefinition {
  type: Type;
  id: Id;
  relation: RelationName | RelationKey;
  linkedId: Id;
  indices?: [Index?, Index?];
}

export interface UnlinkDefinition {
  type: Type,
  id: Id,
  relation: RelationName | RelationKey,
  linkedId: Id,
}

export interface Selectors {
  getResource: (state: State, cid: CompositeId) => Data;
}
