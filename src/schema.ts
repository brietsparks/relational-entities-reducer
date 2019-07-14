import { Cardinality, RelationKey, RelationName, Type } from './interfaces';
import { ONE } from './constants';

export class Entities {
  getEntity(type: Type): Entity {
    return new Entity();
  }
}

export class Entity {
  constructor() {

  }

  getOwnReciprocalCardinality(relation: RelationName|RelationKey): Cardinality {
    return ONE;
  }

  getRelatedReciprocalKey(relation: RelationName|RelationKey): RelationKey {
    return 'a';
  }

  getRelatedReciprocalCardinality(relation: RelationName|RelationKey): Cardinality {
    return ONE;
  }
}
