import { isObjectLiteral } from '../util';
import { RelationKey, Type } from '../interfaces';
import { MANY, ONE } from '../constants';

export type Schema = {
  [t in Type]: EntitySchema
}

export type EntitySchema = {
  [k in RelationKey]: RelationSchema
}

export type RelationSchema = {
  has: 'many' | 'one',
  type: Type,
  reciprocalKey?: RelationKey,
  alias?: string
}

type ReciprocalKeyLookup = {
  [t in Type]: { [k in RelationKey]: RelationKey }
}

export class InvalidSchema extends Error {}

export const validateSchema = (schema: Schema) => {
  validateObject(schema, 'schema');

  Object.entries(schema).forEach(([entityType, entitySchema]) => {
    validateObject(entitySchema, `.${entityType}`);

    const reciprocalKeyValidator = new ReciprocalKeyValidator(entityType);

    Object.entries(entitySchema).forEach(([relationKey, relation]) => {
      validateObject(relation, `.${entityType}.${relationKey}`);

      // a relation .has must be "many" or "one"
      if (relation.has !== MANY && relation.has !== ONE) {
        throw new InvalidSchema(`.${entityType}.${relationKey}.has must be either "many" or "one"`)
      }

      // a relation .type must be a string
      validateString(relation.type, `.${entityType}.${relationKey}.type`);

      // a related entity must be defined at the root level of the model
      if (!schema.hasOwnProperty(relation.type)) {
        throw new InvalidSchema(`.${entityType}.${relationKey}.type "${relation.type}" is invalid because ${relation.type} is not defined as an entity`);
      }

      // a related related entity must have a relation that points back to this entity
      let hasReciprocalRelation = false;

      const relatedDef = schema[relation.type];
      Object.values(relatedDef).forEach(reciprocal => {
        if (reciprocal.type === entityType) {
          hasReciprocalRelation = true;
        }
      });

      if (!hasReciprocalRelation) {
        throw new InvalidSchema(`.${entityType}.${relationKey}.type "${relation.type}" is invalid because ${relation.type} does not have a reciprocal relation for ${entityType}`);
      }

      reciprocalKeyValidator.addRelationKey(relation.type, relationKey, relation.reciprocalKey);
    });

    reciprocalKeyValidator.validate(schema);
  });
};

export class ReciprocalKeyValidator {
  type: Type;
  lookup: {
    [relatedType in Type]: { [fk in RelationKey]: RelationKey | undefined }
  };

  constructor(type: Type) {
    this.type = type;
    this.lookup = {};
  }

  addRelationKey(relatedType: Type, fk: RelationKey, reciprocalKey?: RelationKey) {
    if (!this.lookup.hasOwnProperty(relatedType)) {
      this.lookup[relatedType] = {};
    }

    this.lookup[relatedType][fk] = reciprocalKey;
  }

  validate(modelSchema: Schema) {
    Object.entries(this.lookup).forEach(([relatedType, mapping]) => {
      if (Object.values(mapping).length === 1) {
        return;
      }

      Object.entries(mapping).forEach(([fk, reciprocalFk]) => {
        if (!reciprocalFk || !modelSchema[relatedType][reciprocalFk]) {
          throw new Error(`.${this.type}.${fk} requires .reciprocalKey to specify which ${relatedType} attribute points back to .${this.type}.${fk}`);
        }
      });
    });
  }
}

const validateObject = (v: any, phrase: string) => {
  if (!isObjectLiteral(v)) {
    throw new InvalidSchema(`${phrase} must be an object`);
  }
};

const validateString = (v: any, phrase: string) => {
  if (typeof v !== 'string') {
    throw new InvalidSchema(`${phrase} must be a string`);
  }
};
