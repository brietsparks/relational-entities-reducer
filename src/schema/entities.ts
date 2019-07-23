import { Cardinality, RelationKey, RelationName, State, Type } from '../interfaces';
import { MANY, ONE } from '../constants';
import { validateSchema, Schema, EntitySchema, RelationSchema } from './schema';

interface RelationDefinition {
  type: Type,
  relationKey: RelationKey
  relatedType: Type,
  relationName: RelationName,
  cardinality: Cardinality,
  reciprocalKey: RelationKey,
  reciprocalCardinality: Cardinality
}

export class Entities {
  schema: Schema;
  entities: { [t in Type]: Entity };

  constructor(schema: Schema) {
    validateSchema(schema);

    this.schema = schema;

    this.entities = {};
    Object.entries(schema).forEach(([type, entitySchema]) => {
      this.entities[type] = new Entity(type, entitySchema, this)
    });
  }

  getEntity(type: Type): Entity {
    const entity = this.entities[type];

    if (!(entity instanceof Entity)) {
      throw new Error(`model does not have an entity of type "${type}"`)
    }

    return entity;
  }

  getTypes(): Type[] {
    return Object.keys(this.schema);
  }

  getEmptyState() {
    return this.getTypes().reduce((state, type) => {
      state[type] = {
        resources: {},
        ids: []
      };

      return state;
    }, {} as State)
  }
}

export class Entity {
  type: Type;
  schema: EntitySchema;
  entities: Entities;

  constructor(type: Type, schema: EntitySchema, entities: Entities) {
    this.type = type;
    this.schema = schema;
    this.entities = entities;
  }

  private schemaEntries() {
    return Object.entries(this.schema);
  }

  getRelationSchema(relationKey: RelationKey): RelationSchema {
    const relationSchema = this.schema[relationKey];

    if (!relationSchema) {
    }

    return relationSchema;
  }

  hasRelationKey(relationKey: RelationKey): boolean {
    return !!this.schema[relationKey];
  }

  getManyRelationKeys() {
    return this.schemaEntries()
      .filter(([, { has }]) => has === MANY)
      .map(([relationKey]) => relationKey);
  }

  getOneRelationKeys() {
    return this.schemaEntries()
      .filter(([, { has }]) => has === ONE)
      .map(([relationKey]) => relationKey);
  }

  getRelationKey(relation: RelationKey|RelationName): RelationKey {
    if (this.hasRelationKey(relation)) {
      return relation;
    }

    for (let [relationKey, relationSchema] of this.schemaEntries()) {
      if (relation === relationSchema.type) {
        if (relationSchema.alias) {
          throw new Error(`for entity "${this.type}", cannot get relationKey for relation "${relation}" because more than one key points to that that entity. Try getting the key by its entity alias`)
        }

        return relationKey;
      }

      if (relation === relationSchema.alias) {
        return relationKey;
      }
    }

    throw this.errorRelationDoesNotExist(relation);
  }

  getRelationName(relationKey: RelationKey): RelationName {
    const { type, alias } = this.getRelationSchema(relationKey);
    return alias ? alias : type;
  }

  hasRelation(relation: RelationName|RelationKey): boolean {
    if (this.schema[relation]) {
      return true;
    }

    for (let [, relationSchema] of this.schemaEntries()) {
      if (relationSchema.type === relation && !relationSchema.alias) {
        return true;
      }

      if (relationSchema.alias === relation) {
        return true;
      }
    }

    return false;
  }

  getReciprocalKey(relationKey: RelationKey): RelationKey {
    const { type: relatedType, reciprocalKey } = this.getRelationSchema(relationKey);

    if (reciprocalKey) {
      return reciprocalKey;
    }

    return this.entities.getEntity(relatedType).getRelationKey(this.type);
  }

  getRelationDefinition(relationKey: RelationKey): RelationDefinition {
    const { type: relatedType, has: cardinality } = this.getRelationSchema(relationKey);
    const reciprocalKey = this.getReciprocalKey(relationKey);
    const { has: reciprocalCardinality } = this.entities.getEntity(relatedType).getRelationSchema(reciprocalKey);
    const relationName = this.getRelationName(relationKey);

    return {
      type: this.type,
      relationKey,
      relatedType,
      relationName,
      cardinality,
      reciprocalKey,
      reciprocalCardinality
    };
  }

  getManyRelationDefinitions(): RelationDefinition[] {
    return this.getManyRelationKeys().map(relationKey => this.getRelationDefinition(relationKey));
  }

  getOneRelationDefinitions(): RelationDefinition[] {
    return this.getOneRelationKeys().map(relationKey => this.getRelationDefinition(relationKey));
  }

  getRelationType(relationKey: RelationKey): Type {
    return 'a';
  }

  getCardinality(relationKey: RelationKey): Cardinality {
    return ONE;
  }

  getOwnReciprocalCardinality(relation: RelationKey): Cardinality {
    return ONE;
  }

  getRelatedReciprocalKey(relationKey: RelationKey): RelationKey {
    return 'a';
  }

  getRelatedReciprocalCardinality(relation: RelationKey): Cardinality {
    return ONE;
  }


  private errorRelationKeyDoesNotExist() {
  }

  private errorRelationDoesNotExist(relation: RelationName|RelationKey) {
    throw new Error(`entity "${this.type}" does not contain a relation with the name or key "${relation}"`)
  }

}
