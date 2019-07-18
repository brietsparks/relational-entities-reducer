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
    return [{ relatedType: 'mockRelType', linkedId: 'mockId', relationName: 'mockRel', relationKey: 'mockKey', index: 3 }];
  }
}
