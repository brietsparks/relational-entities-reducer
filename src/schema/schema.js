const { makeManyFk, makeOneFk } = require('./util');

class Schema {
  constructor(type, one = [], many = []) {
    this.type = type;
    this.entityType = type;
    this.one = one;
    this.many = many;

    const oneFksByEntityType = {}, entityTypesByOneFk = {};
    this.one.forEach(entityType => {
      const oneFk = makeOneFk(entityType);
      oneFksByEntityType[entityType] = oneFk;
      entityTypesByOneFk[oneFk] = entityType;
    });

    const manyFksByEntityType = {}, entityTypesByManyFk = {};
    this.many.forEach(entityType => {
      const manyFk = makeManyFk(entityType);
      manyFksByEntityType[entityType] = manyFk;
      entityTypesByManyFk[manyFk] = entityType;
    });

    this.oneFksByEntityType = oneFksByEntityType;
    this.entityTypesByOneFk = entityTypesByOneFk;
    this.manyFksByEntityType = manyFksByEntityType;
    this.entityTypesByManyFk = entityTypesByManyFk;
  }

  getOneForeignKey(entityType, throws = true) {
    const oneFk = this.oneFksByEntityType[entityType];

    if (!oneFk && throws) {
      throw new Error(`${this.type} has no one-relation of "${entityType}", so no foreign key was found`);
    }

    return oneFk;
  }

  getManyForeignKey(entityType, throws = true) {
    const manyFk = this.manyFksByEntityType[entityType];

    if (!manyFk && throws) {
      throw new Error(`${this.type} has no many-relation of "${entityType}", so no foreign key was found`);
    }

    return manyFk;
  }

  getForeignKey(entityType, throws = true) {
    const oneFk = this.getOneForeignKey(entityType, false);

    if (oneFk) {
      return oneFk;
    }

    const manyFk = this.getManyForeignKey(entityType, false);

    if (manyFk) {
      return manyFk;
    }

    if (throws) {
      throw new Error(`${this.type} has no relation to "${entityType}", so no foreign key was found`);
    }
  }

  getOneEntityType(foreignKey, throws = true) {
    const oneEntityType = this.entityTypesByOneFk[foreignKey];

    if (!oneEntityType && throws) {
      throw new Error(`${this.type} has no one-relation foreign key "${foreignKey}", so no entity type was found`);
    }

    return oneEntityType;
  }

  getManyEntityType(foreignKey, throws = true) {
    const manyEntityType = this.entityTypesByManyFk[foreignKey];

    if (!manyEntityType && throws) {
      throw new Error(`${this.type} has no many-relation foreign key "${foreignKey}", so no entity type was found`);
    }

    return manyEntityType;
  }

  getEntityType(foreignKey, throws = true) {
    const oneEntityType = this.getOneEntityType(foreignKey, false);

    if (oneEntityType) {
      return oneEntityType;
    }

    const manyEntityType = this.getManyEntityType(foreignKey, false);

    if (manyEntityType) {
      return manyEntityType;
    }

    if (throws) {
      throw new Error(`${this.type} has no foreign key "${foreignKey}", so no entity type was found`);
    }
  }

  hasOne(entityType) {
    return this.one.includes(entityType);
  }

  hasMany(entityType) {
    return this.many.includes(entityType);
  }

  has(entityType) {
    return this.hasOne(entityType) || this.hasMany(entityType);
  }
}

module.exports = { Schema };