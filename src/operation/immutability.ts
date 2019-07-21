import { Cardinality, Data, Id, Index, RelationKey } from '../interfaces';

/*
* TODO: refactor to agnostic functions
* */
export const setOneRelationId = (data: Data, relationKey: RelationKey, id: Id|null) => {
  return { ...data, [relationKey]: id };
};

export const setManyRelationId = (data: Data, relationKey: RelationKey, id: Id, index?: Index) => {
  // make sure the ids are an array
  const relationData = Array.isArray(data[relationKey]) ? [...data[relationKey]] : [];

  // add the id
  if (!relationData.includes(id)) {
    index ? relationData.splice(index, 0, id) : relationData.push(id);
  }

  return { ...data, [relationKey]: relationData };
};

export const removeManyRelationId = (
  data: Data, relationKey: RelationKey, relation: Index|Id, byId?: boolean
) => {
  if (!Array.isArray(data[relationKey])) {
    throw new Error(`expected relationKey "${relationKey}" to be an array`);
  }

  const relationData = [ ...data[relationKey] ];

  let index: Index;
  if (byId) {
    index = relationData.indexOf(relation);
    index = index as Index
  } else {
    index = relation as Index;
  }

  relationData.splice(index, 1);

  return { ...data, [relationKey]: relationData };
};
