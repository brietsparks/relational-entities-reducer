import { Cardinality, RelationKey, RelationName, Type } from '../interfaces';
import { ONE } from '../constants';
import { validateSchema, Schema, EntitySchema } from './schema';

interface RelationDefinition {
  subjectType: Type,
  relationKey: RelationKey
  relatedType: Type,
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
      this.entities[type] = new Entity(type, entitySchema)
    });
  }

  getEntity(type: Type): Entity {
    const entity = this.entities[type];

    if (!(entity instanceof Entity)) {
      throw new Error(`model does not have an entity of type "${type}"`)
    }

    return entity;
  }
}

export class Entity {
  type: Type;
  schema: EntitySchema;

  constructor(type: Type, schema: EntitySchema) {
    this.type = type;
    this.schema = schema;
  }

  hasRelation(relation: RelationKey|RelationName): boolean {
    return true
  }

  hasRelationKey(relationKey: RelationKey): boolean {
    return !!this.schema[relationKey];
  }

  private schemaEntries() {
    return Object.entries(this.schema);
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

  getRelationDefinition(relationKey: RelationKey): RelationDefinition {
    return {
      subjectType: 'Type,',
      relationKey: 'RelationKey',
      relatedType: 'Type,',
      cardinality: 'many',
      reciprocalKey: 'RelationKey,',
      reciprocalCardinality: 'many',
    }
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
