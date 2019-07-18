import { Cardinality, RelationKey, RelationName, Type } from './interfaces';
import { ONE } from './constants';

export class Entities {
  getEntity(type: Type): Entity {
    return new Entity();
  }
}

interface RelationDefinition {
  subjectType: Type,
  relationKey: RelationKey
  relatedType: Type,
  cardinality: Cardinality,
  reciprocalKey: RelationKey,
  reciprocalCardinality: Cardinality
}

export class Entity {
  constructor() {

  }

  hasRelationKey(relationKey: RelationKey): boolean {
    return true;
  }

  getRelationDefinition(relationKey: RelationKey): RelationDefinition {
  }

  getRelatedType(relationKey: RelationKey): Type {
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
}
