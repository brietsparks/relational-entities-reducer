import { Entities, Entity } from './schema';
import { Data, Id, Selectors, State, Type, Link, RelationName, RelationKey } from './interfaces';
// import Resource from './resource';

export default class Model {
  entities: Entities;
  state: State;
  selectors: Selectors;

  constructor(entities: Entities, state: State, selectors: Selectors) {
    this.entities = entities;
    this.state = state;
    this.selectors = selectors;
  }

  getEntity(type: Type): Entity {
    return this.entities.getEntity(type);
  }

  // getRelationType(type: Type, relationKey: RelationKey): Type {
  //   return this.entities.getEntity(type).getRelationType(relationKey);
  // }

  getRelationKey(type: Type, relation: RelationName|RelationKey): RelationKey {
    return this.getEntity(type).getRelationKey(relation);
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
