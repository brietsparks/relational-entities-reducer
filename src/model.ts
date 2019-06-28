export type EntityDef = {
  many?: string[],
  one?: string[],
  foreignKeys?: { [entityType: string]: string }
}

export type EntityDefs = {
  [entityType: string]: EntityDef
}

export function validateEntityDefs(entityDefs: EntityDefs = {}) {
  Object.keys(entityDefs).forEach((entityType: string) => {
    const entityDef = entityDefs[entityType];

    if (typeof entityDef !== 'object' || entityDef === null) {
      throw new Error(`the '${entityType}' entity definition must be an object`);
    }

    const { many = [], one = [] } = entityDef;

    if (!(many instanceof Array)) {
      throw new Error(`${entityType} .many must be an array`);
    }

    many.forEach(relatedType => {
      if (!entityDefs.hasOwnProperty(relatedType)) {
        throw new Error(`${entityType} contains .many.${relatedType}, but ${relatedType} is not defined as an entity`);
      }

      if (one.includes(relatedType)) {
        throw new Error(`${entityType} cannot have ${relatedType} as both a .many and .one relation`);
      }
    });

    if (!(one instanceof Array)) {
      throw new Error(`${entityType} .one must be an array`);
    }

    one.forEach(relatedType => {
      if (!entityDefs.hasOwnProperty(relatedType)) {
        throw new Error(`${entityType} contains .one.${relatedType}, but ${relatedType} is not defined as an entity`);
      }
    });
  });
}
