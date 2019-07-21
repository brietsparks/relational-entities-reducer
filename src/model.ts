import { Entities, Entity } from './schema';
import { Data, Id, Selectors, State, Type, Link, RelationName, RelationKey, Index } from './interfaces';

export default class Model {
  entities: Entities;
  selectors: Selectors;
  state: State;

  constructor(entities: Entities, selectors: Selectors, state: State) {
    this.entities = entities;
    this.selectors = selectors;
    this.state = state;
  }

  getEntity(type: Type): Entity {
    return this.entities.getEntity(type);
  }

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
    const entity = this.getEntity(type);

    const manyRelationLinks = entity
      .getManyRelationDefinitions()
      .reduce((links, relationDefinition) => {
        const { relationKey, relatedType, relationName } = relationDefinition;

        const linkedIds = data[relationKey];

        if (Array.isArray(linkedIds)) {
          const link = linkedIds.map((linkedId: Id, index: Index) => ({
            relatedType, linkedId, relationKey, relationName, index
          }));

          links.push(...link);
        }

        return links;
      }, [] as Link[]);

    const oneRelationLinks = entity
      .getOneRelationDefinitions()
      .reduce((links, relationDefinition) => {
        const { relationKey, relatedType, relationName } = relationDefinition;

        const linkedId = data[relationKey];
        if (linkedId) {
          links.push({ relatedType, linkedId, relationName, relationKey })
        }

        return links;
      }, [] as Link[]);

    return [...manyRelationLinks, ...oneRelationLinks];
  }

  // getRelationType(type: Type, relationKey: RelationKey): Type {
  //   return this.entities.getEntity(type).getRelationType(relationKey);
  // }
}
