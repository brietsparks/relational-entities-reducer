import { Model, State, Id, Type, Data, CidObject, RelationName } from './interfaces';

export interface ResourceInterface {
  getLinks(): { linkedId: Id, relationName: RelationName, index: number }[];
}

export default class Resource implements ResourceInterface{
  constructor(model: Model, state: State, type: Type, id: Id, data: Data = {}) {
  }

  getLinks(): { linkedId: Id, relationName: RelationName, index: number }[] {}
}
