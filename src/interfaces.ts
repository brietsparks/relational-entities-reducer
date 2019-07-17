export interface State {}

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
  relationName: RelationName,
  relationKey: RelationKey,
  index?: Index,
}

export interface LinkRemovalCallback {
  (): LinkRemovalSchema;
}

export type LinkRemovalSchema = {
  [s in RelationKey]: LinkRemovalSchema | LinkRemovalCallback
}

export type OpId = string;

export type Operator = 'add' | 'edit' | 'remove';

export type IndicesByRelation = { [s in RelationName | RelationKey]: number };

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

export interface EditOperation {
  operator: 'edit';
}

export interface AddOptions {
  index?: Index;
  indicesByRelation?: IndicesByRelation;
  ignoreIdIndex?: boolean;
}

export interface RemoveOptions {
  removeLinked?: LinkRemovalSchema
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
  linked: Index | Id,
  byId?: boolean
}

export interface Selectors {
  getResource: (state: State, cid: CompositeId) => Data;
}
