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

  getRelationType(type: Type, relationKey: RelationKey): Type {
    return 'mock type'
  }

  getRelationKey(type: Type, relation: RelationName|RelationKey): RelationKey {
    return 'mock key'
  }

  getResource(type: Type, id: Id): Data {
    return this.selectors.getResource(this.state, { type, id });
  }

  hasResource(type: Type, id: Id): boolean {
    return !!this.getResource(type, id);
  }

  extractAllLinks(type: Type, data: Data): Link[] {
    // get the names of the relation keys from the schema
    return [{ relationName: 'mockRel', relationKey: 'mockKey', linkedId: 'mockId', index: 3 }];
  }

  extractLink(type: Type, relatedType: Type, data: Data): Link|undefined {
    // get the name of the relation key from the schema

    return { relationName: 'oneRel', relationKey: 'mockKey', linkedId: 'mockId' };
  }

  extractLinkedId(type: Type, relatedType: Type, data: Data): Id|undefined {
    return 'mock id'
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
