import { Entities, Entity } from './schema';
import { Data, Id, Selectors, State, Type, Link, RelationName, RelationKey } from './interfaces';
// import Resource from './resource';

export default class Model {
  schema: Entities;
  state: State;
  selectors: Selectors;

  constructor(entities: Entities, state: State, selectors: Selectors) {
    this.schema = entities;
    this.state = state;
    this.selectors = selectors;
  }

  getEntity(type: Type): Entity {
    return new Entity();
  }

  getRelationType(type: Type, relation: RelationName|RelationKey): Type {
    return 'mock type'
  }

  getResource(type: Type, id: Id): Data {
    return this.selectors.getResource(this.state, { type, id });
  }

  hasResource(type: Type, id: Id): boolean {
    return !!this.getResource(type, id);
  }

  extractLinks(type: Type, id: Id, data: Data): Link[] {
    // the schema will tell us the names of the relation keys
    return [{ relationName: 'mockRel', linkedId: 'mockId', index: 3 }];
  }

  // getResource(type: Type, id: Id, data?: Data): Resource {
  //   data = data || this.getResourceData(type, id);
  //   return new Resource(this, type, id, data);
  // }
  //
  // getResourceData(type: Type, id: Id): Data {
  //   return this.selectors.getResource(this.state, { type, id });
  // }
}
