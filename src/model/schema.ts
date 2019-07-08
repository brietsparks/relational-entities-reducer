import { isObject } from '../util';
import { Fkey, Type, MANY, ONE } from '../interfaces';

export type ModelSchema = {
  [t in Type]: EntitySchema
}

export type EntitySchema = {
  [k in Fkey]: Relation
}

export type Relation = {
  has: 'many' | 'one',
  type: Type,
  reciprocalKey?: Fkey
}

type ReciprocalKeyLookup = {
  [t in Type]: { [k in Fkey]: Fkey }
}

export class InvalidSchema extends Error {}

export const validateSchema = (schema: ModelSchema) => {
  validateObject(schema, 'schema');

  Object.entries(schema).forEach(([entityType, entitySchema]) => {
    validateObject(entitySchema, `.${entityType}`);

    const reciprocalKeyValidator = new ReciprocalKeyValidator(entityType);

    Object.entries(entitySchema).forEach(([foreignKey, relation]) => {
      validateObject(relation, `.${entityType}.${foreignKey}`);

      // a relation .has must be "many" or "one"
      if (relation.has !== MANY && relation.has !== ONE) {
        throw new InvalidSchema(`.${entityType}.${foreignKey}.has must be either "many" or "one"`)
      }

      // a relation .type must be a string
      validateString(relation.type, `.${entityType}.${foreignKey}.type`);

      // a foreign entity must be defined at the root level of the model
      if (!schema.hasOwnProperty(relation.type)) {
        throw new InvalidSchema(`.${entityType}.${foreignKey}.type "${relation.type}" is invalid because ${relation.type} is not defined as an entity`);
      }

      // a related foreign entity must have a relation that points back to this entity
      let hasReciprocalRelation = false;

      const foreignDef = schema[relation.type];
      Object.values(foreignDef).forEach((foreignRelation) => {
        if (foreignRelation.type === entityType) {
          hasReciprocalRelation = true;
        }
      });

      if (!hasReciprocalRelation) {
        throw new InvalidSchema(`.${entityType}.${foreignKey}.type "${relation.type}" is invalid because ${relation.type} does not have a reciprocal relation for ${entityType}`);
      }

      reciprocalKeyValidator.addForeignKey(relation.type, foreignKey, relation.reciprocalKey);
    });

    reciprocalKeyValidator.validate(schema);
  });
};

export class ReciprocalKeyValidator {
  type: Type;
  lookup: {
    [relatedType in Type]: { [fk in Fkey]: Fkey | undefined }
  };

  constructor(type: Type) {
    this.type = type;
    this.lookup = {};
  }

  addForeignKey(relatedType: Type, fk: Fkey, reciprocalKey?: Fkey) {
    if (!this.lookup.hasOwnProperty(relatedType)) {
      this.lookup[relatedType] = {};
    }

    this.lookup[relatedType][fk] = reciprocalKey;
  }

  validate(modelSchema: ModelSchema) {
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
  if (!isObject(v)) {
    throw new InvalidSchema(`${phrase} must be an object`);
  }
};

const validateString = (v: any, phrase: string) => {
  if (typeof v !== 'string') {
    throw new InvalidSchema(`${phrase} must be a string`);
  }
};
