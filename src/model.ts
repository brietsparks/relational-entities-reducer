export const MANY = 'many';
export const ONE = 'one';

type Relations = {
  [foreignKey: string]: Relation
}

type Relation = {
  has: 'many' | 'one',
  type: string
}

export type ModelDef = {
  [entityType: string]: Relations
}

export class Entity {
  constructor(type: string, relations: Relations, model: Model) {
  }
}

export class Model {
}

export class InvalidModelDefinition extends Error {}

export const validateModelDef = (modelDef: ModelDef) => {
  validateObject(modelDef, 'model definition');

  Object.keys(modelDef).forEach(entityType => {
    const relations = modelDef[entityType];

    validateObject(relations, `.${entityType}`);

    Object.keys(relations).forEach(foreignKey => {
      const relation = relations[foreignKey];

      validateObject(relation, `.${entityType}.${foreignKey}`);

      // a relation .has must be "many" or "one"
      if (relation.has !== MANY && relation.has !== ONE) {
        throw new InvalidModelDefinition(`.${entityType}.${foreignKey}.has must be either "many" or "one"`)
      }

      // a relation .type must be a string
      validateString(relation.type, `.${entityType}.${foreignKey}.type`);

      // a foreign entity must be defined at the root level of the model
      if (!modelDef.hasOwnProperty(relation.type)) {
        throw new InvalidModelDefinition(`.${entityType}.${foreignKey}.type "${relation.type}" is invalid because ${relation.type} is not defined as an entity`);
      }

      // a related foreign entity must have a relation that points back to this entity
      let hasReciprocalRelation = false;

      const foreignDef = modelDef[relation.type];
      Object.keys(foreignDef).forEach(foreignForeignKey => {
        const foreignRelation = foreignDef[foreignForeignKey];
        if (foreignRelation.type === entityType) {
          hasReciprocalRelation = true;
        }
      });

      if (!hasReciprocalRelation) {
        throw new InvalidModelDefinition(`.${entityType}.${foreignKey}.type "${relation.type}" is invalid because ${relation.type} does not have a reciprocal relation for ${entityType}`);
      }
    })
  });
};

const validateObject = (v: any, phrase: string) => {
  if (typeof v !== 'object' || v === null) {
    throw new InvalidModelDefinition(`${phrase} must be an object`);
  }
};

const validateString = (v: any, phrase: string) => {
  if (typeof v !== 'string') {
    throw new InvalidModelDefinition(`${phrase} must be a string`);
  }
};
