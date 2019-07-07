import { ModelSchema, EntitySchema, validateSchema } from './schema';
import {
  Type,
  Id,
  Fkey,
  Data,
  State,
  ONE,
  MANY,
  Cardinality,
  RelatedPointer,
  ResourcesState,
  IdsState,
  CollectionState
} from './resource';
import { Relation } from './schema';

export class Entity {
  type: Type;
  schema: EntitySchema;
  model: Model;

  constructor(type: string, schema: EntitySchema, model: Model) {
    this.type = type;
    this.schema = schema;
    this.model = model;
  }

  errorEntityNotRelated(relatedType: Type) {
    throw new Error(`entity "${this.type}" does not have a relation to entity "${relatedType}"`);
  }

  errorFkDoesNotExist(fk: Fkey) {
    return new Error(`entity "${this.type}" has no fk "${fk}"`);
  }

  hasFk(fk: Fkey): boolean {
    return Object.keys(this.schema).includes(fk);
  }

  isManyFk(fk: Fkey): boolean {
    if (!this.hasFk(fk)) {
      throw this.errorFkDoesNotExist(fk);
    }

    return this.schema[fk].has === MANY;
  }

  isOneFk(fk: Fkey): boolean {
    if (!this.hasFk(fk)) {
      throw this.errorFkDoesNotExist(fk);
    }

    return this.schema[fk].has === ONE;
  }

  getFksMany(): Fkey[] {
    return Object.entries(this.schema).reduce((fksMany, [fk, { has }]) => {
      if (has === MANY) {
        fksMany.push(fk);
      }

      return fksMany;
    }, [] as Fkey[])
  }

  getFksByType(relatedType: Type): Fkey[] {
    const fks: Fkey[] = [];

    for (let [fk, { type }] of Object.entries(this.schema)) {
      if (relatedType === type) {
        fks.push(fk);
      }
    }

    if (fks.length === 0) {
      throw this.errorEntityNotRelated(relatedType);
    }

    return fks;
  }

  getEntityDefByFk(fk: Fkey): Relation {
    for (let [existingFk, def] of Object.entries(this.schema)) {
      if (fk === existingFk) {
        return def
      }
    }

    throw this.errorFkDoesNotExist(fk);
  }

  getTypeByFk(fk: Fkey): Type {
    const { type } = this.getEntityDefByFk(fk);

    return type;
  }

  getEntityByFk(fk: Fkey): Entity {
    const type = this.getTypeByFk(fk);

    return this.model.getEntity(type);
  }

  getCardinalityByFk(fk: Fkey): Cardinality {
    const { has } = this.getEntityDefByFk(fk);

    return has;
  }

  getReciprocalKeyByFk(fk: Fkey): Fkey {
    const { reciprocalKey } = this.getEntityDefByFk(fk);

    if (!reciprocalKey) {
      return this
        .getEntityByFk(fk)
        .getFksByType(this.type)[0];
    }

    return reciprocalKey;
  }

  extractRelatedPointersOne(resource: Data): RelatedPointer[] {
    const relatedPointers: RelatedPointer[] = [];

    Object
      .entries(this.schema)
      .forEach(([fk, { type: relatedType, has }]) => {
        if (has === MANY) {
          return;
        }

        const relatedId = resource[fk];
        const reciprocalFk = this.getReciprocalKeyByFk(fk);
        const reciprocalCardinality = this.model.getEntity(relatedType).getCardinalityByFk(reciprocalFk);

        if (relatedId !== undefined) {
          const relatedPointer: RelatedPointer = { relatedId, relatedType, reciprocalCardinality, reciprocalFk };
          relatedPointers.push(relatedPointer);
        }
      });

    return relatedPointers;
  }

  extractRelatedPointersMany(resource: Data): RelatedPointer[] {
    const relatedPointers: RelatedPointer[] = [];

    Object
      .entries(this.schema)
      .forEach(([fk, { type: relatedType, has }]) => {
        if (has === ONE) {
          return;
        }

        const relatedIds: Id[] = resource[fk] || [];
        const reciprocalFk = this.getReciprocalKeyByFk(fk);
        const reciprocalCardinality = this.model.getEntity(relatedType).getCardinalityByFk(reciprocalFk);

        relatedIds.forEach(relatedId => {
          const relatedPointer: RelatedPointer = { relatedId, relatedType, reciprocalCardinality, reciprocalFk };
          relatedPointers.push(relatedPointer);
        })
      });

    return relatedPointers;
  }

  extractRelatedPointers(resource: Data): RelatedPointer[] {
    const one = this.extractRelatedPointersOne(resource);
    const many = this.extractRelatedPointersMany(resource);

    return [...one, ...many];
  }
}

type Entities = { [type: string]: Entity };

export class Model {
  entities: Entities;

  constructor(schema: ModelSchema) {
    validateSchema(schema);

    this.entities = Object.keys(schema).reduce((entities, entityType) => {
      const entitySchema = schema[entityType];
      entities[entityType] = new Entity(entityType, entitySchema, this);
      return entities;
    }, {} as Entities);
  }

  validateEntityType(type: Type) {
    const entity = this.entities[type];

    if (!(entity instanceof Entity)) {
      throw new Error(`model does not have an entity of type "${type}"`)
    }
  }

  hasEntity(type: Type): boolean {
    const entity = this.entities[type];
    return entity instanceof Entity;
  }

  getEntityTypes(): Type[] {
    return Object.keys(this.entities);
  }

  getEmptyState(): State {
    return Object.keys(this.entities).reduce((state, type) => {
      state[type] = Model.getEmptyCollectionState();
      return state;
    }, {} as State);
  }

  static getEmptyCollectionState(): CollectionState {
    return {
      resources: Model.getEmptyResourcesState(),
      ids: Model.getEmptyIdsState()
    }
  }

  static getEmptyResourcesState(): ResourcesState {
    return {};
  }

  static getEmptyIdsState(): IdsState  {
    return [];
  }

  getEntity(type: Type): Entity {
    this.validateEntityType(type);

    return this.entities[type];
  }
}
